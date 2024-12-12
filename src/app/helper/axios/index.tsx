"use client";
import React from "react";
// ** libraries
import axios, { AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";

// ** config
import { BASE_URL, API_ENDPOINT } from "../../config/api";

// ** helper
import {
  clearLocalUserData,
  getLocalUserData,
  setLocalUserData,
} from "../storage/index";

// ** Next
import { useRouter } from "next/navigation";
import { NextRouter } from "next/router";

// ** React
import { FC, useEffect } from "react";

// ** types
import { UserDataType } from "../../contexts/types";

// ** hooks
import { UseAuth } from "../../hooks/UseAuth";

// ** intercepter
import { refreshToken } from "src/app/services/auth";

type TAxiosInterceptor = {
  children: React.ReactNode;
};

const instanceAxios = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

//instanceAxios.defaults.withCredentials = true; // use to set value of cookie

let isRefreshing = false;
let failedQueue: any[] = [];

const handleRedirectLogin = (
  router: any,
  setUser: (data: UserDataType | null) => void
) => {
  if (router.asPath !== "/" && typeof router.asPath === "string") {
    router.replace({
      pathname: "/login",
      query: { returnUrl: router.asPath },
    });
  } else {
    router.replace("/login");
  }
  setUser(null);
  clearLocalUserData();
};

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

const addRequestQueue = (config: AxiosRequestConfig): Promise<any> => {
  return new Promise((resolve, reject) => {
    failedQueue.push({
      resolve: (token: string) => {
        if (config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        resolve(config);
      },
      reject: (err: any) => {
        reject(err);
      },
    });
  });
};

const AxiosInterceptor: FC<TAxiosInterceptor> = ({ children }) => {
  const router = useRouter();
  const { setUser, user } = UseAuth();

  useEffect(() => {
    const reqInterceptor = instanceAxios.interceptors.request.use(
      async (config) => {
        const { accessToken, refreshToken } = getLocalUserData();
        if (accessToken) {
          let decodedAccessToken: any = {};
          decodedAccessToken = jwtDecode(accessToken);
          if (decodedAccessToken?.exp > Date.now() / 1000) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
          } else if (refreshToken) {
            if (!isRefreshing) {
              isRefreshing = true;

              const configCredentials: AxiosRequestConfig = {
                withCredentials: true, // Automatically send cookies with the request
              };
              await axios
                .post(
                  `${API_ENDPOINT.AUTH.INDEX}/refresh-token`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${refreshToken}`,
                      cookies: `${refreshToken}`
                    },
                  }
                )
                .then((res) => {
                  const newAccessToken = res?.data.data.access_token;
                  if (newAccessToken) {
                    config.headers["Authorization"] =
                      `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);
                    if (accessToken) {
                      setLocalUserData(
                        JSON.stringify(user),
                        newAccessToken,
                        refreshToken
                      );
                    }
                  } else {
                    handleRedirectLogin(router, setUser);
                  }
                })
                .catch((e) => {
                  processQueue(e, null);
                  handleRedirectLogin(router, setUser);
                })
                .finally(() => {
                  isRefreshing = false;
                });
            } else {
              return await addRequestQueue(config);
            }
          }
        }

        return config;
      }
    );

    const resInterceptor = instanceAxios.interceptors.response.use(
      (response) => {
        return response;
      }
    );

    return () => {
      instanceAxios.interceptors.request.eject(reqInterceptor);
      instanceAxios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return <>{children}</>;
};

export default instanceAxios;
export { AxiosInterceptor };

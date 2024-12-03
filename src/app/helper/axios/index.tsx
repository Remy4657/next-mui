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
import { useAuth } from "../../hooks/useAuth";

type TAxiosInterceptor = {
  children: React.ReactNode;
};

const instanceAxios = axios.create({ baseURL: BASE_URL });

instanceAxios.defaults.withCredentials = true; // use to set value of cookie

let isRefreshing = false;
let failedQueue: any[] = [];

const handleRedirectLogin = (
  router: any,
  setUser: (data: UserDataType | null) => void
) => {
  if (router.asPath !== "/") {
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
  const { setUser, user } = useAuth();

  console.log("user: ", user);

  useEffect(() => {
    const reqInterceptor = instanceAxios.interceptors.request.use(
      async (config) => {
        const { accessToken, refreshToken } = getLocalUserData();
        if (accessToken) {
          let decodedAccessToken: any = {};
          decodedAccessToken = jwtDecode(accessToken);

          if (decodedAccessToken?.exp > Date.now() / 1000) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
          } else {
            if (!isRefreshing) {
              isRefreshing = true;
              await axios
                .post(`http://192.168.30.106:8080/api/v1/auth/refresh-token`, {
                  userId: 4,
                })
                .then((res) => {
                  console.log("res refresh token: ", res);
                  const newAccessToken = res?.data;
                  if (newAccessToken) {
                    config.headers["Authorization"] =
                      `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);
                    if (accessToken) {
                      setLocalUserData(
                        JSON.stringify(user),
                        newAccessToken,
                        "refreshtoken"
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

            // if (refreshToken) {
            //   const decodedRefreshToken: any = jwtDecode(refreshToken);

            //   if (decodedRefreshToken?.exp > Date.now() / 1000) {
            //     if (!isRefreshing) {
            //       isRefreshing = true;
            //       await axios
            //         .post(
            //           `http://192.168.30.106:8080/api/v1/auth/refresh-token`,
            //           {},
            //           {
            //             headers: {
            //               Authorization: `Bearer ${refreshToken}`,
            //             },
            //           }
            //         )
            //         .then((res) => {
            //           const newAccessToken = res?.data;
            //           if (newAccessToken) {
            //             config.headers["Authorization"] =
            //               `Bearer ${newAccessToken}`;
            //             processQueue(null, newAccessToken);
            //             if (accessToken) {
            //               setLocalUserData(
            //                 JSON.stringify(user),
            //                 newAccessToken,
            //                 refreshToken
            //               );
            //             }
            //           } else {
            //             handleRedirectLogin(router, setUser);
            //           }
            //         })
            //         .catch((e) => {
            //           processQueue(e, null);
            //           handleRedirectLogin(router, setUser);
            //         })
            //         .finally(() => {
            //           isRefreshing = false;
            //         });
            //     } else {
            //       return await addRequestQueue(config);
            //     }
            //   } else {
            //     handleRedirectLogin(router, setUser);
            //   }
            // } else {
            //   handleRedirectLogin(router, setUser);
            // }
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

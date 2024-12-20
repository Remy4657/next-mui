"use client";
// ** React Imports
import React, { createContext, useEffect, useState, ReactNode } from "react";

// ** Next Import
import { useRouter, usePathname } from "next/navigation";

// ** Types
import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  UserDataType,
} from "./types";

// ** instance axios
import instanceAxios from "../helper/axios/index";
import toast from "react-hot-toast";

// ** Config
import { API_ENDPOINT } from "../config/api";

// ** services
import { loginAuth } from "../services/auth";
import { logoutAuth } from "../services/auth";

// ** helper
import { clearLocalUserData, setLocalUserData } from "../helper/storage";

// ** jwt decode
import { jwtDecode } from "jwt-decode";

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);

  // ** Hooks
  const router = useRouter();
  const pathname = usePathname();

  // ** get user info when refresh page
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem("accessToken");
      if (storedToken) {
        setLoading(true);
        await instanceAxios
          .get(`${API_ENDPOINT.AUTH.AUTH_ME}`)
          .then(async (response) => {
            setLoading(false);
            setUser({ ...response.data.data });
          })
          .catch((e) => {
            logoutAuth().then((res) => {
              clearLocalUserData();
              setUser(null);
              setLoading(false);
              if (!pathname.includes("login")) {
                router.replace("/login");
              }
            });
          });
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);
  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType
  ) => {
    loginAuth({
      email: params.email,
      password: params.password,
    })
      .then(async (response) => {
        setLocalUserData(
          JSON.stringify(response.data),
          response.data.access_token,
          response.data.refresh_token
        );
        toast.success("Login success");
        // const returnUrl = router.query.returnUrl;
        setUser({ ...response.data });
        const redirectURL = "/";
        //window.location.href("http://localhost:3000/");
        router.replace(redirectURL as string);
      })

      .catch((err) => {
        toast.error("Email or password wrong");
        if (errorCallback) errorCallback(err);
      });
  };
  const handleLogout = () => {
    logoutAuth().then((res) => {
      setUser(null);
      clearLocalUserData();
      // signOut()
      router.replace("/login");
    });
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

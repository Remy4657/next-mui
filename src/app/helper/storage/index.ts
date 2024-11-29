import {
  ACCESS_TOKEN,
  DEVICE_TOKEN,
  PRE_AUTH_TOKEN,
  REFRESH_TOKEN,
  REMEMBER_AUTH_TOKEN,
  TEMPORARY_TOKEN,
  USER_DATA,
} from "../../config/auth";

export const getLocalUserData = () => {
  if (typeof window !== "undefined") {
    return {
      userData: window.localStorage.getItem(USER_DATA),
      accessToken: window.localStorage.getItem(ACCESS_TOKEN),
      refreshToken: window.localStorage.getItem(REFRESH_TOKEN),
    };
  }

  return {
    userData: "",
    accessToken: "",
    refreshToken: "",
  };
};
export const setLocalUserData = (
  userData: string,
  accessToken: string,
  refreshToken: string
) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USER_DATA, userData),
      window.localStorage.setItem(ACCESS_TOKEN, accessToken),
      window.localStorage.setItem(REFRESH_TOKEN, refreshToken);
  }
};

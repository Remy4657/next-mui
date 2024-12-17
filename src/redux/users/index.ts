import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ** axios imports
import {
  changePasswordMeAsync,
  forgotPasswordAuthAsync,
  registerAuthAsync,
} from "src/redux/users/actions";

// * type
import { UserDataType } from "src/contexts/types";

type TInitialData = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  typeError: string;
  isSuccessUpdateMe: boolean;
  isErrorUpdateMe: boolean;
  messageUpdateMe: string;
  isSuccessChangePassword: boolean;
  isErrorChangePassword: boolean;
  messageChangePassword: string;
  userData: UserDataType | null;
  isSuccessResetPassword: boolean;
  isErrorResetPassword: boolean;
  messageResetPassword: string;
  isSuccessForgotPassword: boolean;
  isErrorForgotPassword: boolean;
  messageForgotPassword: string;
};
const initialState: TInitialData = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: "",
  typeError: "",
  isSuccessUpdateMe: true,
  isErrorUpdateMe: false,
  messageUpdateMe: "",
  isSuccessChangePassword: true,
  isErrorChangePassword: false,
  messageChangePassword: "",
  userData: null,
  isSuccessForgotPassword: true,
  isErrorForgotPassword: false,
  messageForgotPassword: "",
  isSuccessResetPassword: true,
  isErrorResetPassword: false,
  messageResetPassword: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetInitialState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.message = "";
      state.typeError = "";
      state.isSuccessUpdateMe = false;
      state.isErrorUpdateMe = true;
      state.messageUpdateMe = "";
      state.isSuccessChangePassword = false;
      state.isErrorChangePassword = true;
      state.messageChangePassword = "";
      state.isSuccessForgotPassword = false;
      state.isErrorForgotPassword = true;
      state.messageForgotPassword = "";
      state.isSuccessResetPassword = false;
      state.isErrorResetPassword = true;
      state.messageResetPassword = "";
    },
  },
  extraReducers: (builder) => {
    // ** register
    builder.addCase(registerAuthAsync.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(registerAuthAsync.fulfilled, (state, action) => {
      console.log("action fulfilled: ", action);
      state.isLoading = false;
      state.isSuccess = !!action.payload?.data?.email;
      state.isError = !action.payload?.data?.email;
      state.message = action.payload?.message;
      state.typeError = action.payload?.typeError;
    });
    builder.addCase(registerAuthAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = true;
      state.message = "";
      state.typeError = "";
    });
  },
});

// Action creators are generated for each case reducer function
export const { resetInitialState } = authSlice.actions;

export default authSlice.reducer;

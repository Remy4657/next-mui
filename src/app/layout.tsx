import React, { Suspense } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from "../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SidebarWrapper from "../component/SidebarWrapper/page";

// * redux
import { StoreWrapper } from "./StoreWrapper";
import { store } from "../redux/store";
import { Provider } from "react-redux";

//** toast */
import { Toaster } from "react-hot-toast";

// ** Contexts
import { AuthProvider } from "../contexts/AuthContext";

// ** auth hoock
import { UseAuth } from "../hooks/useAuth";

// axios instance
import { AxiosInterceptor } from "../helper/axios";

// ** import file
import Loading from "../component/common/loading";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body className="" suppressHydrationWarning>
        <StoreWrapper>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline enableColorScheme />
              <AuthProvider>
                <AxiosInterceptor>
                  <SidebarWrapper>
                    {children}
                    <Toaster />
                  </SidebarWrapper>
                </AxiosInterceptor>
              </AuthProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </StoreWrapper>
      </body>
    </html>
  );
}

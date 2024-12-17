"use client";

import { usePathname } from "next/navigation";

// ** import file
import Sidebar from "../Sidebar/page";
import { UseAuth } from "../../hooks/useAuth";

// ** import header
import ResponsiveAppBar from "../header/page";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = UseAuth();

  const pathname = usePathname();
  const isLoginPage =
    pathname === "/login" || pathname === "/register" || pathname === "/401";

  return (
    <>
      {!isLoginPage && <ResponsiveAppBar />}
      {children}
    </>
  );
}

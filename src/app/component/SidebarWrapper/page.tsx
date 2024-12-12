"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../Sidebar/page";
import { useRouter } from "next/router";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname === "/401";

  return (
    <>
      {!isLoginPage && <Sidebar />}
      {children}
    </>
  );
}

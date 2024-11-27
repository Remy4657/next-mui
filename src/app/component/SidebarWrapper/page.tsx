"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../page";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Sidebar />}
      {children}
    </>
  );
}

"use client";

import { logout } from "../login/actions";

export default function Dashboard() {
  // function getCookie(name: string): string | undefined {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);

  //   if (parts.length === 2) {
  //     return parts.pop()?.split(";")?.shift();
  //   }

  //   return undefined;
  // }

  // // Example usage:
  // const myCookieValue = getCookie("session");
  // console.log("my session: ", myCookieValue);
  return (
    <div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

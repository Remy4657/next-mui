import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/test/lib/session";
import { decodeToken } from "./app/test/lib/session";

const protectedRoutes = ["/about"];
const publicRoutes = ["/test/login"];

interface Session {
  permissions: string[];
}
export default async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    //const access_token = localStorage.getItem('accessToken')

    const cookieStore = await cookies();
    const cookie = cookieStore.get("refresh_token")?.value;
    const session = (await decodeToken(cookie as string)) as Session;
    console.log("cookie: ", cookie);
    console.log("decode cookie: ", typeof session);
    // console.log("isProtectedRoute: ", isProtectedRoute);
    // console.log("isPublicRoute: ", isPublicRoute);
    console.log("path: ", path);

    if (isProtectedRoute && session?.permissions?.includes("USER.GRANTED")) {
      return NextResponse.redirect(new URL("/401", req.nextUrl));
    }

    // if (isPublicRoute && session?.userId) {
    //   return NextResponse.redirect(new URL("/test/dashboard", req.nextUrl));
    // }

    return NextResponse.next();
  } catch (error) {
    console.log("error: ", error);
  }
}

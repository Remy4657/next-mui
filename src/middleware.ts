import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "./lib/session";

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
    if (cookieStore.get("refresh_token")?.value) {
      var cookie = cookieStore.get("refresh_token")?.value as string;
    }
    const session = (await decodeToken(cookie)) as Session;

    if (isProtectedRoute && session?.permissions?.includes("USER.GRANTED")) {
      return NextResponse.redirect(new URL("/401", req.nextUrl));
    }

    // if (isPublicRoute && session?.userId) {
    //   return NextResponse.redirect(new URL("/test/dashboard", req.nextUrl));
    // }

    return NextResponse.next();
  } catch (error) {
    console.log("error middleware: ", error);
  }
}

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "./lib/session";

const protectedRoutes = ["/about"];
const publicRoutes = ["/test/login"];

interface Session {
  permissions: string[];
  exp: number;
}
export default async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    //const access_token = localStorage.getItem('accessToken')

    const cookieStore = await cookies();
    if (cookieStore.get("accessToken")) {
      var cookie = cookieStore.get("accessToken")?.value as string;
      var session = (await decodeToken(cookie)) as Session;
    }
    // if (session?.exp < Date.now() / 1000) {
    //   return NextResponse.redirect(new URL("/login", req.nextUrl));
    // }
    if (
      isProtectedRoute &&
      // access token don't expired
      //session?.exp > Date.now() / 1000 &&
      !session?.permissions?.includes("USER.GRANTED")
    ) {
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

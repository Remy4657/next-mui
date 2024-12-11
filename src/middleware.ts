
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/test/lib/session";

const protectedRoutes = ["/"];
const publicRoutes = ["/test/login"];

export default async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  //const access_token = localStorage.getItem('accessToken')
  console.log("req: ", req)

  const cookieStore = await cookies();
const cookie = cookieStore.get("session")?.value;
  console.log("cookie: ", cookie)
  const session = await decrypt(cookie);
  console.log("session: ", session)
  console.log("isProtectedRoute: ", isProtectedRoute)
  console.log("path: ", path)
  

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/about", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/test/dashboard", req.nextUrl));
  }

  return NextResponse.next();
  } catch (error) {
    console.log("error: ", error)
  }

  
}
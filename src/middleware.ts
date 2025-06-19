import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const restrictedPaths = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/otp-verification",
  "/reset_password",
  "/email-verification",
];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("care_giver_token");

  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.startsWith("/success")
  ) {
    return NextResponse.next();
  }

  if ((!token && !restrictedPaths.includes(pathname)) || pathname === "/") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export default middleware;

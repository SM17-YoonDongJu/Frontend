import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/shared/lib/auth-cookie";

const LOGIN_REQUIRED_PATH = "/login-required";

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(ACCESS_TOKEN_COOKIE);
  if (hasSession) return NextResponse.next();

  const loginRequiredUrl = new URL(LOGIN_REQUIRED_PATH, request.url);
  loginRequiredUrl.searchParams.set(
    "from",
    request.nextUrl.pathname + request.nextUrl.search,
  );
  return NextResponse.redirect(loginRequiredUrl);
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/partner/:path*",
    "/notifications/:path*",
    "/withdraw/:path*",
  ],
};

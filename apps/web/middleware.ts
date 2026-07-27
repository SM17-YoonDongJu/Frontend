import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/shared/lib/auth-cookie";
import { getRoleFromAccessToken } from "@/shared/lib/jwt";

const LOGIN_REQUIRED_PATH = "/login-required";
const CUSTOMER_HOME_PATH = "/customer/dashboard";
const PARTNER_HOME_PATH = "/partner";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    const loginRequiredUrl = new URL(LOGIN_REQUIRED_PATH, request.url);
    loginRequiredUrl.searchParams.set(
      "from",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(loginRequiredUrl);
  }

  const { pathname } = request.nextUrl;
  const role = getRoleFromAccessToken(accessToken);

  // 사정사 자격 상태(role)만 판별 — ADMIN은 이슈 범위(고객↔사정사 교차) 밖이라 통과.
  if (role === "USER" && pathname.startsWith("/partner")) {
    return NextResponse.redirect(new URL(CUSTOMER_HOME_PATH, request.url));
  }
  if (
    (role === "CERTIFICATED_ADJUSTER" || role === "UNCERTIFICATED_ADJUSTER") &&
    pathname.startsWith("/customer")
  ) {
    return NextResponse.redirect(new URL(PARTNER_HOME_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/partner/:path*",
    "/notifications/:path*",
    "/withdraw/:path*",
  ],
};

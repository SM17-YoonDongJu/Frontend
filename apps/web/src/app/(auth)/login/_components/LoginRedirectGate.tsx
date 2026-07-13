"use client";

import type { ReactNode } from "react";
import { useLoginRedirect } from "../_hooks/use-login-redirect";

/**
 * 인증 판별 client 래퍼. 로그인 유저는 홈으로 보내는 동안 로그인 화면을 숨기고,
 * 미인증(401·기타 에러 fail-open)일 때만 로그인 화면을 표시한다.
 */
export function LoginRedirectGate({ children }: { children: ReactNode }) {
  const status = useLoginRedirect();

  if (status !== "unauthenticated") return null;

  return <>{children}</>;
}

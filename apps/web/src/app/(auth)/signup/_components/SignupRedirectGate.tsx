"use client";

import type { ReactNode } from "react";
import { useSignupRedirect } from "../_hooks/use-signup-redirect";

/**
 * 인증 판별 client 래퍼. 로그인 유저는 홈으로 보내는 동안 가입 화면을 숨기고,
 * 미인증(401·기타 에러 fail-open)일 때만 가입 퍼널을 표시한다.
 */
export function SignupRedirectGate({ children }: { children: ReactNode }) {
  const status = useSignupRedirect();

  if (status !== "unauthenticated") return null;

  return <>{children}</>;
}

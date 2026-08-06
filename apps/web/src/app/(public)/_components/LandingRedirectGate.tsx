"use client";

import type { ReactNode } from "react";
import { useLandingRedirect } from "../_hooks/use-landing-redirect";

/**
 * 인증 판별 client 래퍼. 로그인 유저는 대시보드로 보내는 동안 랜딩을 숨기고,
 * 미인증(401·기타 에러 fail-open)일 때만 랜딩을 표시한다.
 */
export function LandingRedirectGate({ children }: { children: ReactNode }) {
  const status = useLandingRedirect();

  if (status !== "unauthenticated") return null;

  return <>{children}</>;
}

"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LandingRedirectGate } from "./LandingRedirectGate";

/**
 * (public) 레이아웃 래퍼. 랜딩(/)에서만 헤더·푸터까지 인증 게이트로 감싸
 * 로그인 유저 리다이렉트 중 온보딩 화면이 비치는 깜빡임을 막는다.
 * 그 외 공개 페이지(about·guide·terms·privacy)는 로그인 여부와 무관하게 즉시 표시.
 */
export function PublicChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname !== "/") return <>{children}</>;

  return <LandingRedirectGate>{children}</LandingRedirectGate>;
}

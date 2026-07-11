"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/shared/api/use-auth-status";

const REDIRECT_BY_USER_TYPE = {
  insured_person: "/customer/dashboard",
  adjuster: "/partner"
} as const;

/**
 * 로그인 상태면 userType별 경로로 replace. 반환값으로 랜딩 표시 여부 판단.
 * - "loading": 판별 중 → 랜딩 숨김(무표시)
 * - "authenticated": 리다이렉트 진행 → 랜딩 숨김
 * - "unauthenticated"(401·기타 에러 fail-open): 랜딩 표시
 */
export function useLandingRedirect() {
  const router = useRouter();
  const auth = useAuthStatus();

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    router.replace(REDIRECT_BY_USER_TYPE[auth.me.userType]);
  }, [auth, router]);

  return auth.status;
}

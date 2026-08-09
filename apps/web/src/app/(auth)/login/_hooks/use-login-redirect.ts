"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/shared/api/use-auth-status";
import { consumeReturnPath } from "@/shared/lib/return-path";
import { homePathByUserType } from "@/shared/model/home-path";

/**
 * 로그인 상태면 저장된 복귀 경로(없으면 userType별 홈)로 replace. 반환값으로 로그인 화면 표시 여부 판단.
 * - "loading": 판별 중 → 로그인 화면 숨김(깜빡임 방지)
 * - "authenticated": 리다이렉트 진행 → 로그인 화면 숨김
 * - "unauthenticated"(401·기타 에러 fail-open): 로그인 화면 표시
 */
export function useLoginRedirect() {
  const router = useRouter();
  const auth = useAuthStatus();

  useEffect(() => {
    if (auth.status !== "authenticated") return;
    router.replace(consumeReturnPath() ?? homePathByUserType(auth.me.userType));
  }, [auth, router]);

  return auth.status;
}

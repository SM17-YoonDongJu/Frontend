"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/shared/api/use-auth-status";
import { homePathByUserType } from "@/shared/model/home-path";

/**
 * 진입 시점에 로그인 상태면 userType별 홈으로 replace. 반환값으로 가입 화면 표시 여부 판단.
 * - "loading": 판별 중 → 가입 화면 숨김(깜빡임 방지)
 * - "authenticated": 리다이렉트 진행 → 가입 화면 숨김
 * - "unauthenticated"(401·기타 에러 fail-open): 가입 화면 표시
 *
 * 판정은 최초 1회로 고정한다 — 가입 성공 시 users.me 갱신으로 로그인 상태가 되어도
 * 완료 화면이 홈으로 이탈하지 않도록.
 */
export function useSignupRedirect() {
  const router = useRouter();
  const auth = useAuthStatus();
  const [entryStatus, setEntryStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    if (entryStatus !== "loading" || auth.status === "loading") return;
    setEntryStatus(auth.status);
    if (auth.status === "authenticated") {
      router.replace(homePathByUserType(auth.me.userType));
    }
  }, [auth, entryStatus, router]);

  return entryStatus;
}

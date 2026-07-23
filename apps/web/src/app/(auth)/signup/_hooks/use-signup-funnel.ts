"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/** 가입 퍼널 단계 키. ?step= 값 겸용. */
export const SIGNUP_STEPS = ["role", "terms", "identity", "done"] as const;

export type SignupStep = (typeof SIGNUP_STEPS)[number];

export const SIGNUP_STEP_TOTAL = SIGNUP_STEPS.length;

function toStep(value: string | null): SignupStep {
  return SIGNUP_STEPS.find((step) => step === value) ?? "role";
}

/** ?step=role|terms|identity|done 로 현재 단계 관리. 새로고침 시 위치 유지, 뒤로가기=히스토리. */
export function useSignupFunnel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = toStep(searchParams.get("step"));
  const index = SIGNUP_STEPS.indexOf(step);

  const goTo = useCallback(
    (next: SignupStep, opts?: { replace?: boolean }) => {
      const params = new URLSearchParams(searchParams);
      params.set("step", next);
      const url = `?${params.toString()}`;
      if (opts?.replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [router, searchParams],
  );

  return {
    step,
    /** 1-based 진행 위치(진행바용) */
    stepNumber: index + 1,
    total: SIGNUP_STEP_TOTAL,
    goTo,
    back: useCallback(() => router.back(), [router]),
  };
}

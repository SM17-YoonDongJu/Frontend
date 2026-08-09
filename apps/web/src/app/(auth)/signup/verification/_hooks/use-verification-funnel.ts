"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/** 자격 인증 퍼널 단계 키. ?step= 값 겸용. */
export const VERIFICATION_STEPS = ["basic", "expertise", "documents"] as const;

export type VerificationStep = (typeof VERIFICATION_STEPS)[number];

export const VERIFICATION_STEP_TOTAL = VERIFICATION_STEPS.length;

function toStep(value: string | null): VerificationStep {
  return VERIFICATION_STEPS.find((step) => step === value) ?? "basic";
}

/** ?step=basic|expertise|documents 로 현재 단계 관리(모바일 3스텝 퍼널). */
export function useVerificationFunnel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = toStep(searchParams.get("step"));
  const index = VERIFICATION_STEPS.indexOf(step);

  const goTo = useCallback(
    (next: VerificationStep, opts?: { replace?: boolean }) => {
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
    total: VERIFICATION_STEP_TOTAL,
    isFirst: index === 0,
    isLast: index === VERIFICATION_STEP_TOTAL - 1,
    goTo,
    next: useCallback(() => {
      const nextStep = VERIFICATION_STEPS[index + 1];
      if (nextStep) {
        const params = new URLSearchParams(searchParams);
        params.set("step", nextStep);
        router.push(`?${params.toString()}`, { scroll: false });
      }
    }, [index, router, searchParams]),
    back: useCallback(() => router.back(), [router]),
  };
}

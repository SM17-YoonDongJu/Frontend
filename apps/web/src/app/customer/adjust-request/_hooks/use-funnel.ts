"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { FUNNEL_TOTAL } from "../_model/funnel-config";

const clamp = (n: number) => Math.min(Math.max(n, 1), FUNNEL_TOTAL);

/** ?step= 으로 현재 단계 관리. 새로고침 시 위치 유지. */
export function useFunnel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = clamp(Number(searchParams.get("step")) || 1);

  const goTo = useCallback(
    (step: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("step", String(clamp(step)));
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const next = useCallback(() => goTo(currentStep + 1), [goTo, currentStep]);
  const prev = useCallback(() => goTo(currentStep - 1), [goTo, currentStep]);

  return {
    currentStep,
    total: FUNNEL_TOTAL,
    isFirst: currentStep === 1,
    isLast: currentStep === FUNNEL_TOTAL,
    goTo,
    next,
    prev,
  };
}

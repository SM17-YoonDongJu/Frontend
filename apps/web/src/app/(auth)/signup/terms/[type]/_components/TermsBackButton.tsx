"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";

/** 약관 상세 → 가입 퍼널 복귀(브라우저 히스토리 back으로 동의 상태 유지). */
export function TermsBackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="이전으로"
      className="flex size-9 items-center justify-center rounded-chip text-ink transition hover:bg-paper"
    >
      <ChevronRight className="rotate-180 text-[1.25rem]" />
    </button>
  );
}

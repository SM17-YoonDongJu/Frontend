"use client";

import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { Button } from "@/shared/ui/Button";
import type { AdjusterApplicationStatus } from "../../_model/adjuster-application.schema";

interface ApprovedNoticeProps {
  application: AdjusterApplicationStatus;
  onEnterPartner: () => void;
  onHome: () => void;
}

/** 승인(APPROVED) — 검수 배지 발급 안내 + 파트너 영역 진입. */
export function ApprovedNotice({ application, onEnterPartner, onHome }: ApprovedNoticeProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-[4.5rem] items-center justify-center rounded-full bg-green-soft text-[1.75rem] text-green">
        <ShieldCheck />
      </span>
      <p className="mt-5 text-[0.84375rem] font-bold text-green">인증 완료</p>
      <h1 className="mt-2 font-serif text-[1.75rem] font-bold text-ink">
        자격 인증이 완료되었어요
      </h1>
      <p className="mt-3 break-keep text-sm leading-relaxed text-ink-2">
        {application.name}님, 검수 인증 배지가 발급됐어요.
        <br className="hidden sm:block" /> 이제 파트너 영역에서 활동을 시작할 수 있어요.
      </p>

      <div className="mt-7 flex w-full flex-col items-center gap-3">
        <Button full size="lg" onClick={onEnterPartner} icon={<ArrowRight className="text-[1.125rem]" />}>
          파트너 영역 진입하기
        </Button>
        <button
          type="button"
          onClick={onHome}
          className="py-1.5 text-sm font-semibold text-ink-3 transition hover:text-ink"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}

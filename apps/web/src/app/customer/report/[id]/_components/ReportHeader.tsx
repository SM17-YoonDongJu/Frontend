"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Check } from "@/shared/ui/icons/Check";
import { ChevronLeft } from "@/shared/ui/icons/ChevronLeft";
import { REPORT_TITLE } from "../_model/report-meta";

export interface ReportHeaderProps {
  accidentType: string;
  treatment: string;
  issueCount: number;
  /** 데스크톱 우측 액션 블록(PDF·공유) */
  actions?: ReactNode;
  /** 모바일 상단 바 우측 공유 아이콘 버튼 */
  mobileShare?: ReactNode;
}

export function ReportHeader({
  accidentType,
  treatment,
  issueCount,
  actions,
  mobileShare,
}: ReportHeaderProps) {
  const router = useRouter();

  return (
    <>
      {/* 모바일: 얇은 back 바 */}
      <div className="sticky top-0 z-10 -mx-5 flex h-[3.6875rem] items-center justify-between border-b border-line-2 bg-paper px-4 lg:hidden">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="flex size-[2.375rem] items-center justify-center rounded-full text-ink transition hover:bg-paper-2"
        >
          <ChevronLeft className="text-[1.375rem]" />
        </button>
        <h1 className="text-[0.9375rem] font-bold text-ink">분석 리포트</h1>
        <div className="flex size-[2.375rem] items-center justify-center">{mobileShare}</div>
      </div>

      {/* 데스크톱: 기존 메타 pill + serif 타이틀 + actions */}
      <header className="hidden flex-wrap items-start justify-between gap-4 lg:flex">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 text-[0.78rem] text-ink-3">
            <span className="rounded-pill bg-paper-2 px-2.5 py-1">{accidentType}</span>
            <span className="rounded-pill bg-paper-2 px-2.5 py-1">{treatment}</span>
            <span className="flex items-center gap-1 rounded-pill bg-green-soft px-2.5 py-1 text-green">
              <Check className="text-[0.8125rem]" />
              쟁점 {issueCount}건
            </span>
          </div>
          <h1 className="mt-2 font-serif text-[1.625rem] font-bold text-ink">{REPORT_TITLE}</h1>
        </div>

        {actions}
      </header>
    </>
  );
}

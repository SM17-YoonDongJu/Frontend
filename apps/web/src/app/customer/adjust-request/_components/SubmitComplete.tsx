"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import type { CreateReportResponse } from "../_model/types";

/** 리포트 프로세스 상태 라벨 — ERD REPORTS.status 기준. */
const STATUS_LABELS: Record<string, string> = {
  AWAITING_INSPECTION: "검수 대기 중",
  AWAITING_ADOPTION: "채택 대기 중",
  COUNSELING: "상담 중",
  CLOSED: "종결",
  NOT_SELECTED: "선택 받지 못함",
};

interface SubmitCompleteProps {
  result: CreateReportResponse;
  onRestart: () => void;
}

export function SubmitComplete({ result, onRestart }: SubmitCompleteProps) {
  return (
    <div className="mx-auto w-full max-w-[35rem] px-4 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-soft">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-green">
          <path d="m5 12.5 4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mt-5 font-serif text-[1.5rem] font-bold text-ink">분석 요청이 접수됐어요</h1>
      <p className="mt-2 text-[0.875rem] text-ink-3">
        입력하신 정보로 약관·특약·판례를 분석합니다. 진행 상황은 내 리포트에서 확인할 수 있어요.
      </p>

      <div className="mt-6 rounded-card border border-line bg-paper-2 px-4 py-3 text-left">
        <div className="flex items-center justify-between border-b border-line py-2.5">
          <span className="text-[0.8125rem] text-ink-3">진행 상태</span>
          <span className="rounded-pill bg-gold-soft px-2.5 py-1 text-[0.78125rem] font-semibold text-gold-ink">
            {STATUS_LABELS[result.status] ?? result.status}
          </span>
        </div>
        <div className="flex items-center justify-between py-2.5">
          <span className="text-[0.8125rem] text-ink-3">요청 번호</span>
          <span className="text-[0.8125rem] font-medium text-ink">{result.reportId}</span>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-2">
        <Link href="/customer/dashboard">
          <Button full>내 리포트로 이동</Button>
        </Link>
        <Button variant="ghost" full onClick={onRestart}>
          새 분석 요청
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Check } from "@/shared/ui/icons/Check";
import { Search } from "@/shared/ui/icons/Search";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import type { AdjusterApplicationStatus } from "../../_model/adjuster-application.schema";
import { SubmittedDocuments } from "./SubmittedDocuments";

interface ReviewTimelineProps {
  application: AdjusterApplicationStatus;
  onHome: () => void;
}

const pad = (value: number) => String(value).padStart(2, "0");

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** 심사 진행(PENDING) — 3단계 타임라인 + 제출 서류 보기. */
export function ReviewTimeline({ application, onHome }: ReviewTimelineProps) {
  const [showDocuments, setShowDocuments] = useState(false);

  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-[4.5rem] items-center justify-center rounded-full bg-gold-soft text-[1.75rem] text-gold-ink">
        <Search />
      </span>
      <p className="mt-5 text-[0.84375rem] font-bold text-gold-ink">심사 진행 중</p>
      <h1 className="mt-2 font-serif text-[1.75rem] font-bold text-ink">
        자격 인증을 심사하고 있어요
      </h1>
      <p className="mt-3 break-keep text-sm leading-relaxed text-ink-2">
        영업일 기준 2~3일 내에 결과를 알림과 이메일로 알려드릴게요.
        <br className="hidden sm:block" /> 심사 중에도 일반 사용자 기능은 그대로 이용할 수 있어요.
      </p>

      <div className="mt-7 w-full rounded-card border border-line bg-card p-5 text-left">
        <ol className="flex flex-col divide-y divide-line-2">
          <li className="flex items-center gap-3.5 pb-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-green-soft text-[1.125rem] text-green">
              <Check />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.90625rem] font-bold text-ink">서류 제출 완료</p>
              <p className="mt-0.5 text-[0.78125rem] text-ink-3">
                {formatDateTime(application.submittedAt)}
              </p>
            </div>
            <span className="shrink-0 text-[0.8125rem] font-bold text-green">완료</span>
          </li>
          <li className="flex items-center gap-3.5 py-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-gold-soft text-[1.125rem] text-gold-ink">
              <Search />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.90625rem] font-bold text-ink">관리자 서류 검토 중</p>
              <p className="mt-0.5 text-[0.78125rem] text-ink-3">등록번호·증빙 확인</p>
            </div>
            <span className="shrink-0 text-[0.8125rem] font-bold text-gold-ink">진행 중</span>
          </li>
          <li className="flex items-center gap-3.5 pt-4 opacity-50">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-paper text-[1.125rem] text-ink-3">
              <ShieldCheck />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.90625rem] font-bold text-ink">승인·인증 배지 발급</p>
              <p className="mt-0.5 text-[0.78125rem] text-ink-3">파트너 활동 시작</p>
            </div>
          </li>
        </ol>

        {showDocuments && (
          <div className="mt-2 border-t border-line-2 pt-2">
            <SubmittedDocuments documents={application.documents} />
          </div>
        )}
      </div>

      <div className="mt-6 flex w-full flex-col items-center gap-3">
        <Button variant="outline" full onClick={() => setShowDocuments((prev) => !prev)}>
          {showDocuments ? "제출 서류 접기" : "제출 서류 보기"}
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

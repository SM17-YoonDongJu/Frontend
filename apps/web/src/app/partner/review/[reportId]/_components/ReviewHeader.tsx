"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/Button";
import { StatusBadge } from "@/shared/ui/StatusBadge";

/** "교통사고(후유장해)" → "후유장해". 괄호 분류가 있으면 그 값을, 없으면 전체. */
function accidentCategory(accidentType: string): string {
  return accidentType.match(/\(([^)]+)\)/)?.[1] ?? accidentType;
}

export interface ReviewHeaderProps {
  caseId: string;
  treatment: string;
  accidentType: string;
  region: string;
  clientName: string;
  onSaveDraft: () => void;
  isSaving: boolean;
}

export function ReviewHeader({
  caseId,
  treatment,
  accidentType,
  region,
  clientName,
  onSaveDraft,
  isSaving,
}: ReviewHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Link
          href="/partner/review"
          aria-label="검수 대기 목록으로"
          className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-card border border-line bg-card text-ink-2 transition hover:bg-paper"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-serif text-[22px] font-bold text-ink">{treatment} 검수</h1>
            <StatusBadge tone="gold">{accidentCategory(accidentType)}</StatusBadge>
          </div>
          <p className="mt-1 text-[13px] text-ink-3">
            #{caseId} · {region} · {clientName} 의뢰
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge tone="neutral">검수 중 · AI 초안 v1</StatusBadge>
        <Button variant="outline" size="sm" loading={isSaving} onClick={onSaveDraft}>
          임시저장
        </Button>
      </div>
    </div>
  );
}

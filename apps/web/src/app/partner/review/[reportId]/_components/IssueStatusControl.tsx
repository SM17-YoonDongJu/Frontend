"use client";

import { cn } from "@/shared/lib/utils";
import { ISSUE_STATUS_OPTIONS } from "../_model/status-meta";
import type { ReviewIssueStatus } from "../_model/types";

export interface IssueStatusControlProps {
  value: ReviewIssueStatus;
  onChange: (status: ReviewIssueStatus) => void;
}

/** 선택 활성 시 상태별 색: 인정=green, 수정=gold, 제외=terra. */
const ACTIVE_CLASS: Record<(typeof ISSUE_STATUS_OPTIONS)[number]["value"], string> = {
  ACCEPTED: "bg-green text-white",
  MODIFIED: "bg-gold text-white",
  EXCLUDED: "bg-terra text-white",
};

export function IssueStatusControl({ value, onChange }: IssueStatusControlProps) {
  return (
    <div
      role="radiogroup"
      aria-label="쟁점 검수 상태"
      className="inline-flex items-center gap-1 rounded-pill border border-line bg-paper-2 p-1"
    >
      {ISSUE_STATUS_OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-pill px-3 py-1.5 text-[12.5px] font-semibold transition",
              selected ? ACTIVE_CLASS[option.value] : "bg-transparent text-ink-3 hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

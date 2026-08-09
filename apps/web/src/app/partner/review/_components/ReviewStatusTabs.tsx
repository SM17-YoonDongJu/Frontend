"use client";

import type { ReviewStatusCounts } from "../../_shared/model/types";
import { REVIEW_STATUS_PRESETS } from "../_hooks/use-review-filter";

/** status 필터 탭바(단일 선택). 상태는 props로 주입받는 프레젠테이션 컴포넌트. */

interface StatusOption {
  value: string;
  label: string;
}

// 라벨은 Figma 문구 보존 — 빈 상태 문구도 이 목록을 공유.
export const REVIEW_STATUS_OPTIONS: StatusOption[] = [
  { value: "전체", label: "전체" },
  { value: "AWAITING_ADOPTION", label: "전송 완료" },
  { value: "COUNSELING", label: "상담 전환" },
  { value: "NOT_SELECTED", label: "미채택" },
  { value: "CLOSED", label: "종결" },
];

interface Props {
  value: string;
  counts?: ReviewStatusCounts;
  onSelect: (value: string) => void;
  isPending?: boolean;
}

export function ReviewStatusTabs({ value, counts, onSelect, isPending }: Props) {
  // 헤더 "진행 중" 프리셋 진입 시 대응 상태 탭들을 함께 활성 표시.
  const presetValues = REVIEW_STATUS_PRESETS[value];

  return (
    <div
      role="tablist"
      aria-label="상태 필터"
      aria-busy={isPending}
      className={`flex gap-5 overflow-x-auto border-b border-line px-5 pt-3 transition-opacity md:px-0 ${
        isPending ? "opacity-60" : ""
      }`}
    >
      {REVIEW_STATUS_OPTIONS.map((option) => {
        const active = presetValues ? presetValues.includes(option.value) : option.value === value;
        const count = option.value === "전체" ? counts?.total : counts?.[option.value];
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(option.value)}
            className={`-mb-[1px] flex h-7 shrink-0 items-center gap-1.5 border-b text-[0.8125rem] transition ${
              active
                ? "border-navy font-bold text-ink"
                : "border-transparent font-medium text-ink-3 hover:text-ink-2"
            }`}
          >
            {option.label}
            {count !== undefined && (
              <span
                className={`flex h-3.5 min-w-[1.1875rem] items-center justify-center rounded-full px-1.5 text-[0.625rem] font-bold leading-none ${
                  active ? "bg-navy text-white" : "bg-line-2 text-ink-2"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

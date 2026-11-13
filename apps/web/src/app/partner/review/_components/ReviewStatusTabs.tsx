"use client";

/** status 필터 탭바(단일 선택). 상태는 props로 주입받는 프레젠테이션 컴포넌트. */

interface StatusOption {
  value: string;
  label: string;
}

// 라벨은 Figma 문구 보존 — 빈 상태 문구도 이 목록을 공유.
// 검수 대기 API는 검수 단계 리포트만 돌려줘 상담 전환·미채택·종결 탭은 늘 비어 있었다(#326).
export const REVIEW_STATUS_OPTIONS: StatusOption[] = [
  { value: "전체", label: "전체" },
  { value: "AWAITING_ADOPTION", label: "전송 완료" },
];

interface Props {
  value: string;
  onSelect: (value: string) => void;
  isPending?: boolean;
}

export function ReviewStatusTabs({ value, onSelect, isPending }: Props) {
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
        const active = option.value === value;
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
          </button>
        );
      })}
    </div>
  );
}

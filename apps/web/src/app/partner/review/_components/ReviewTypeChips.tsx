"use client";

/** 유형 필터 칩(단일 선택). 상태는 props로 주입받는 프레젠테이션 컴포넌트. */

interface TypeOption {
  value: string;
  label: string;
}

// 라벨은 Figma 문구 보존(실손 ≠ accidentTypeLabel의 "실손 의료비") — 빈 상태 문구도 이 목록을 공유.
export const REVIEW_TYPE_OPTIONS: TypeOption[] = [
  { value: "전체", label: "전체" },
  { value: "disability", label: "후유장해" },
  { value: "traffic", label: "교통사고" },
  { value: "medical_indemnity", label: "실손" },
];

interface Props {
  value: string;
  onSelect: (value: string) => void;
}

export function ReviewTypeChips({ value, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto px-5 pt-3.5 pb-1">
      {REVIEW_TYPE_OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(option.value)}
            className={`shrink-0 rounded-full border px-4 py-[0.56rem] text-[0.84rem] font-semibold transition ${
              active
                ? "border-ink bg-ink text-white"
                : "border-line bg-card text-ink-2 hover:brightness-[.98]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

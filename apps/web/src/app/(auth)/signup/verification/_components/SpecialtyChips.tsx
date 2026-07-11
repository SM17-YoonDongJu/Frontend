"use client";

import { cn } from "@/shared/lib/utils";
import { Check } from "@/shared/ui/icons/Check";

/** 전문분야 복수선택 옵션(Figma STEP2). 전송값=표시 라벨 그대로. */
export const SPECIALTY_OPTIONS = [
  "후유장해",
  "교통사고",
  "실손 의료비",
  "암·진단비",
  "배상책임(대인)",
  "산재 연계",
] as const;

interface SpecialtyChipsProps {
  value: string[];
  onToggle: (value: string) => void;
  "aria-label"?: string;
}

export function SpecialtyChips({ value, onToggle, "aria-label": ariaLabel }: SpecialtyChipsProps) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {SPECIALTY_OPTIONS.map((option) => {
        const selected = value.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            onClick={() => onToggle(option)}
            className={cn(
              "inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-[0.625rem] border px-3.5 py-2 text-[0.8125rem] font-bold transition",
              selected
                ? "border-ink bg-ink text-white"
                : "border-line bg-card text-ink-2 hover:brightness-[.98]",
            )}
          >
            {selected && <Check className="text-[0.8125rem]" />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

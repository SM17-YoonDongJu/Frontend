"use client";

import { cn } from "@/shared/lib/utils";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
}

interface ChoiceChipsProps<T extends string> {
  options: ChoiceOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  "aria-label"?: string;
}

/**
 * 단일 선택 칩 버튼(자격 구분·소속·성별). Figma 131-10583 실측:
 * 선택=네이비 채움+흰 텍스트, 미선택=흰 배경+보더.
 */
export function ChoiceChips<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: ChoiceChipsProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-[0.5625rem]">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-[2.75rem] rounded-button border px-[1.0625rem] py-3 text-[0.90625rem] font-semibold transition",
              selected
                ? "border-navy bg-navy text-white"
                : "border-line bg-card text-ink-2 hover:brightness-[.98]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

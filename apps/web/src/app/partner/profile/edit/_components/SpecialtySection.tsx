"use client";

import { cn } from "@/shared/lib/utils";
import { ToggleChip } from "@/app/customer/adjust-request/_components/ToggleChip";
import { MAX_SPECIALTIES, SPECIALTY_OPTIONS } from "../_model/specialty-options";

interface SpecialtySectionProps {
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
}

export function SpecialtySection({ value, onChange, error }: SpecialtySectionProps) {
  const isFull = value.length >= MAX_SPECIALTIES;

  const toggle = (option: string) => {
    const next = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];
    onChange(next);
  };

  return (
    <section className="space-y-4 rounded-card-lg border border-line bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[1.125rem] font-bold text-ink">전문 분야</h2>
        <span className="text-[0.8125rem] text-ink-3">
          {value.length}/{MAX_SPECIALTIES} · 검색 노출에 사용돼요
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SPECIALTY_OPTIONS.map((option) => {
          const selected = value.includes(option);
          const disabled = !selected && isFull;
          return (
            <span
              key={option}
              className={cn(disabled && "cursor-not-allowed opacity-40 [&>button]:pointer-events-none")}
            >
              <ToggleChip
                label={option}
                selected={selected}
                onClick={() => !disabled && toggle(option)}
              />
            </span>
          );
        })}
      </div>

      {error ? (
        <span className="block text-[0.75rem] font-medium text-terra" role="alert">
          {error}
        </span>
      ) : (
        <p className="text-[0.75rem] text-ink-3">최대 {MAX_SPECIALTIES}개까지 선택할 수 있어요.</p>
      )}
    </section>
  );
}

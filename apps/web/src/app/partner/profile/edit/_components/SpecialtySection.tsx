"use client";

import { cn } from "@/shared/lib/utils";
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
    <section className="space-y-4 lg:rounded-card-lg lg:border lg:border-line lg:bg-card lg:p-6">
      <div className="hidden items-center justify-between lg:flex">
        <h2 className="font-serif text-[1.125rem] font-bold text-ink">전문 분야</h2>
        <span className="text-[0.8125rem] text-ink-3">
          {value.length}/{MAX_SPECIALTIES} · 검색 노출에 사용돼요
        </span>
      </div>

      <span className="block text-[0.8125rem] font-semibold text-ink-2 lg:hidden">
        전문 분야 <span className="font-normal text-ink-3">(중복 선택)</span>
      </span>

      <div className="flex flex-wrap gap-2">
        {SPECIALTY_OPTIONS.map((option) => {
          const selected = value.includes(option);
          const disabled = !selected && isFull;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => !disabled && toggle(option)}
              className={cn(
                "inline-flex items-center gap-1 rounded-chip border px-3.5 py-2 text-[0.875rem] font-medium transition",
                selected
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-paper-2 text-ink-2 hover:border-ink/40",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {selected && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {option}
            </button>
          );
        })}
      </div>

      {error ? (
        <span className="block text-[0.75rem] font-medium text-terra" role="alert">
          {error}
        </span>
      ) : (
        <p className="text-[0.75rem] text-ink-3">
          자격 구분 변경은 증빙 재심사가 필요해 <span className="font-semibold text-gold-ink">인증·자격 증빙</span>에서 진행해요.
        </p>
      )}
    </section>
  );
}

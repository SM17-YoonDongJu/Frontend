"use client";

import { StarRatingInput } from "@/shared/ui/StarRatingInput";

export function OverallRatingSection({
  value,
  onChange,
}: {
  value: number;
  onChange: (score: number) => void;
}) {
  return (
    <section className="rounded-card border border-line bg-card p-[1.625rem]">
      <h2 className="text-[1.0625rem] font-bold text-ink">전체 만족도</h2>
      <p className="mt-1 text-[0.8125rem] text-ink-3">별을 눌러 평가해 주세요.</p>
      <div className="mt-4 flex items-center gap-3">
        <StarRatingInput value={value} onChange={onChange} size="lg" label="전체 만족도" />
        <span className="text-[0.9375rem] font-bold text-ink-3">{value === 0 ? "선택 전" : `${value}점`}</span>
      </div>
    </section>
  );
}

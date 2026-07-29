"use client";

import { useAdjusterHome } from "../_api/use-home";
import { SectionCard } from "./SectionCard";

export function ActivityStats() {
  const { data } = useAdjusterHome();
  const { summary } = data;

  const rows = [
    { label: "검수 완료", value: `${summary.monthlyCompletedCount}건` },
    { label: "상담 전환", value: `${summary.consultationConvertedCount}건` },
    { label: "고객 평점", value: summary.rating.average.toFixed(1) },
  ];

  return (
    <SectionCard title="이번 달 활동" className="self-start">
      <dl className="space-y-3.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <dt className="text-[0.875rem] text-ink-2">{row.label}</dt>
            <dd className="font-serif text-[1.125rem] font-bold tabular-nums text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}

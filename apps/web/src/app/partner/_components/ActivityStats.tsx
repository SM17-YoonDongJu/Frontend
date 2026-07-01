"use client";

import { Megaphone } from "@/shared/ui/icons/Megaphone";
import { useDashboard } from "../_api/use-dashboard";
import { SectionCard } from "./SectionCard";

export function ActivityStats() {
  const { data } = useDashboard();
  const { activity } = data;

  const rows = [
    { label: "검수 완료", value: `${activity.completedCount}건` },
    { label: "상담 전환", value: `${activity.consultConvertedCount}건` },
    { label: "고객 평점", value: activity.averageRating.toFixed(1) },
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

      <div className="mt-5 flex gap-2.5 rounded-card bg-paper-2 p-4">
        <span className="mt-0.5 shrink-0 text-[1rem] text-gold-ink">
          <Megaphone />
        </span>
        <p className="text-[0.8125rem] leading-relaxed text-ink-2">
          매칭률이 높은 사건을 먼저 검수하면 상담 전환율이 올라갑니다.
        </p>
      </div>
    </SectionCard>
  );
}

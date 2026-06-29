"use client";

import { useDashboard } from "../_api/use-dashboard";
import { SectionCard } from "./SectionCard";

export function ActivityStats() {
  const { data } = useDashboard();
  const { activity } = data;

  const rows = [
    { label: "이번 달 검수 완료", value: `${activity.completedCount}건` },
    { label: "상담 전환", value: `${activity.consultConvertedCount}건` },
    { label: "고객 평점", value: activity.averageRating.toFixed(1) },
  ];

  return (
    <SectionCard title="이번 달 활동">
      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <dt className="text-[14px] text-ink-2">{row.label}</dt>
            <dd className="font-serif text-[18px] font-bold tabular-nums text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 rounded-card bg-paper-2 p-4">
        <p className="text-[13px] font-semibold text-gold-ink">검수 팁</p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
          쟁점별 근거를 충분히 정리해 두면 고객 상담 전환율을 높이는 데 도움이 돼요.
        </p>
      </div>
    </SectionCard>
  );
}

import type { MypageMonthlyActivity } from "../_model/types";

interface MonthlyActivityCardProps {
  activity: MypageMonthlyActivity;
}

export function MonthlyActivityCard({ activity }: MonthlyActivityCardProps) {
  const rows = [
    { label: "검수 완료", value: `${activity.completedCount}건` },
    { label: "상담 전환", value: `${activity.consultationConvertedCount}건` },
    { label: "고객 평점", value: activity.averageRating?.toFixed(1) ?? "-" },
  ];

  return (
    <section className="rounded-card-lg border border-line bg-card p-5.5 shadow-sm">
      <h2 className="text-[0.9375rem] font-bold text-ink">이번 달 활동</h2>
      <dl className="mt-3 divide-y divide-line-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3">
            <dt className="text-[0.875rem] text-ink-2">{row.label}</dt>
            <dd className="text-[0.9375rem] font-bold tabular-nums text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

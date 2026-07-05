import { TrendingUp } from "@/shared/ui/icons/TrendingUp";
import type { MypageMonthlyActivity } from "../_model/types";

interface MonthlyActivityCardProps {
  activity: MypageMonthlyActivity;
}

export function MonthlyActivityCard({ activity }: MonthlyActivityCardProps) {
  const rows = [
    { label: "검수 완료", value: `${activity.completedCount}건` },
    { label: "상담 전환", value: `${activity.consultationConvertedCount}건` },
  ];

  return (
    <section className="rounded-card-lg border border-line bg-card p-5.5 shadow-sm">
      <h2 className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
        <TrendingUp className="text-[1rem] text-gold-ink md:hidden" />
        이번 달 활동
      </h2>
      <dl className="mt-3 divide-y divide-line-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3">
            <dt className="text-[0.875rem] text-ink-2">{row.label}</dt>
            <dd className="text-[0.9375rem] font-bold tabular-nums text-ink">{row.value}</dd>
          </div>
        ))}
        <div className="hidden items-center justify-between py-3 md:flex">
          <dt className="text-[0.875rem] text-ink-2">고객 평점</dt>
          <dd className="text-[0.9375rem] font-bold tabular-nums text-ink">
            {activity.averageRating?.toFixed(1) ?? "-"}
          </dd>
        </div>
      </dl>
    </section>
  );
}

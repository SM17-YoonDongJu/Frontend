import { Star } from "@/shared/ui/icons/Star";
import type { MypageStats } from "../_model/types";

interface StatCardsProps {
  stats: MypageStats;
  monthlyCompletedCount: number;
}

export function StatCards({ stats, monthlyCompletedCount }: StatCardsProps) {
  return (
    <>
      <StatCard
        label="평점"
        value={
          <span className="inline-flex items-center gap-1.5">
            <Star className="text-[1.25rem] text-gold" />
            {stats.averageRating?.toFixed(1) ?? "-"}
          </span>
        }
        caption={`후기 ${stats.reviewCount}건`}
      />
      <StatCard
        label="누적 검수"
        value={`${stats.totalCompletedCount}건`}
        caption={`이번 달 ${monthlyCompletedCount}건`}
      />
      <StatCard
        label="상담 전환"
        value={stats.consultationConversionRate == null ? "-" : `${stats.consultationConversionRate}%`}
        caption="검수 대비"
      />
    </>
  );
}

function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: React.ReactNode;
  caption: string;
}) {
  return (
    <div className="rounded-card-lg border border-line bg-card p-5 shadow-sm">
      <p className="text-[0.8125rem] text-ink-3">{label}</p>
      <p className="mt-1 font-serif text-[1.75rem] font-bold tabular-nums text-ink">{value}</p>
      <p className="mt-1 text-[0.75rem] text-ink-3">{caption}</p>
    </div>
  );
}

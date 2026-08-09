import { Star } from "@/shared/ui/icons/Star";
import type { MypageStats } from "../_model/types";
import { StatCard } from "./StatCard";

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
            <Star className="hidden text-[1.25rem] text-gold md:inline" />
            {stats.averageRating?.toFixed(1) ?? "-"}
          </span>
        }
        caption={`후기 ${stats.reviewCount}건`}
      />
      <StatCard
        label="누적 검수"
        value={
          <>
            {stats.totalCompletedCount}
            <span className="hidden md:inline">건</span>
          </>
        }
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

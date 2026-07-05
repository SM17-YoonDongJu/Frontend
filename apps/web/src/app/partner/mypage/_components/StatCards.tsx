import type { ReactNode } from "react";
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

function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: ReactNode;
  caption: string;
}) {
  return (
    <div className="flex flex-col rounded-card border border-line bg-card p-3.5 text-center shadow-sm md:p-[1.3125rem] md:text-left">
      <p className="order-2 mt-1 text-[0.75rem] font-medium text-ink-3 md:order-none md:mt-0">
        {label}
      </p>
      <p className="order-1 font-serif text-[1.25rem] font-bold tabular-nums text-ink md:order-none md:mt-1 md:text-[1.625rem]">
        {value}
      </p>
      <p className="order-3 mt-1 hidden text-[0.6875rem] text-ink-3 md:block">{caption}</p>
    </div>
  );
}

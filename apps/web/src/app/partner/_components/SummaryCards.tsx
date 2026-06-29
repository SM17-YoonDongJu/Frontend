"use client";

import type { ReactNode } from "react";
import { FileText } from "@/shared/ui/icons/FileText";
import { TrendingUp } from "@/shared/ui/icons/TrendingUp";
import { Scale } from "@/shared/ui/icons/Scale";
import { useDashboard } from "../_api/use-dashboard";

interface SummaryCard {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}

export function SummaryCards() {
  const { data } = useDashboard();
  const { summary } = data;

  const cards: SummaryCard[] = [
    {
      icon: <FileText />,
      label: "검수 대기",
      value: `${summary.pendingCount}건`,
      hint: summary.pendingNewCount > 0 ? `신규 ${summary.pendingNewCount}건` : undefined,
    },
    {
      icon: <Scale className="text-base" />,
      label: "진행 중",
      value: `${summary.inProgressCount}건`,
    },
    {
      icon: <TrendingUp />,
      label: "이번 달 완료",
      value: `${summary.monthlyCompletedCount}건`,
      hint: `누적 ${summary.totalCompletedCount.toLocaleString("ko-KR")}건`,
    },
    {
      icon: <TrendingUp />,
      label: "고객 평점",
      value: summary.averageRating.toFixed(1),
      hint: `후기 ${summary.reviewCount}개`,
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <div key={card.label} className="rounded-card-lg border border-line bg-card p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-chip bg-gold-soft text-gold-ink">
            {card.icon}
          </span>
          <p className="mt-3 text-[13px] text-ink-3">{card.label}</p>
          <p className="mt-1 font-serif text-2xl font-bold tabular-nums text-ink">{card.value}</p>
          {card.hint && <p className="mt-0.5 text-[12px] text-gold-ink">{card.hint}</p>}
        </div>
      ))}
    </>
  );
}

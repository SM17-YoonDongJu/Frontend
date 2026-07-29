"use client";

import type { ReactNode } from "react";
import { FileText } from "@/shared/ui/icons/FileText";
import { Pencil } from "@/shared/ui/icons/Pencil";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { Star } from "@/shared/ui/icons/Star";
import { useAdjusterHome } from "../_api/use-home";

interface SummaryCard {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}

export function SummaryCards() {
  const { data } = useAdjusterHome();
  const { summary } = data;

  const cards: SummaryCard[] = [
    {
      icon: <FileText />,
      label: "검수 대기",
      value: `${summary.pendingCount}건`,
      hint: summary.pendingNewCount > 0 ? `신규 ${summary.pendingNewCount}건` : undefined,
    },
    {
      icon: <Pencil />,
      label: "진행 중",
      value: `${summary.inProgressCount}건`,
      hint: "검수·상담 대기",
    },
    {
      icon: <CheckCircle />,
      label: "이번 달 완료",
      value: `${summary.monthlyCompletedCount}건`,
      hint: `누적 ${(summary.totalCompletedCount ?? 0).toLocaleString("ko-KR")}건`,
    },
    {
      icon: <Star />,
      label: "고객 평점",
      value: (summary.rating.average ?? 0).toFixed(1),
      hint: `후기 ${summary.rating.reviewCount ?? 0}건`,
    },
  ];

  return (
    <>
      {cards.map((card) => (
        <div key={card.label} className="rounded-card-lg border border-line bg-card p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-chip bg-gold-soft text-[1rem] text-gold-ink">
              {card.icon}
            </span>
            <p className="text-[0.8125rem] text-ink-3">{card.label}</p>
          </div>
          <p className="mt-4 font-serif text-[1.75rem] font-bold tabular-nums text-ink">{card.value}</p>
          {card.hint && <p className="mt-1 text-[0.75rem] text-ink-3">{card.hint}</p>}
        </div>
      ))}
    </>
  );
}

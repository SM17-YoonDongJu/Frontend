"use client";

import type { ReactNode } from "react";
import { FileText } from "@/shared/ui/icons/FileText";
import { Pencil } from "@/shared/ui/icons/Pencil";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { Star } from "@/shared/ui/icons/Star";
import { useDashboard } from "../_api/use-dashboard";

interface SummaryTile {
  icon: ReactNode;
  chipClass: string;
  label: string;
  value: string;
}

export function MobileSummaryGrid() {
  const { data } = useDashboard();
  const { summary } = data;

  const tiles: SummaryTile[] = [
    {
      icon: <FileText />,
      chipClass: "bg-gold-soft text-gold-ink",
      label: "검수 대기",
      value: `${summary.pendingCount}건`,
    },
    {
      icon: <Pencil />,
      chipClass: "bg-ink/10 text-ink-2",
      label: "진행 중",
      value: `${summary.inProgressCount}건`,
    },
    {
      icon: <CheckCircle />,
      chipClass: "bg-green-soft text-green",
      label: "이번 달 완료",
      value: `${summary.monthlyCompletedCount}건`,
    },
    {
      icon: <Star />,
      chipClass: "bg-gold-soft text-gold-ink",
      label: "고객 평점",
      value: summary.averageRating.toFixed(1),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-[0.6875rem]">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-card border border-line bg-card p-4">
          <span
            className={`flex size-9 items-center justify-center rounded-chip text-[1.125rem] ${tile.chipClass}`}
          >
            {tile.icon}
          </span>
          <p className="mt-2 text-[0.6875rem] text-ink-3">{tile.label}</p>
          <p className="mt-0.5 font-serif text-[1.3125rem] font-bold tabular-nums text-ink">
            {tile.value}
          </p>
        </div>
      ))}
    </div>
  );
}

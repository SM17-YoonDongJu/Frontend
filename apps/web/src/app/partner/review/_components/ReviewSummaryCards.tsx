"use client";

import type { ReactNode } from "react";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { FileText } from "@/shared/ui/icons/FileText";
import { Scale } from "@/shared/ui/icons/Scale";
import { useReviewSummary } from "../_api/use-review-summary";

interface CardMeta {
  key: "pending" | "inProgress" | "dueSoon";
  label: string;
  icon: ReactNode;
  iconClass: string;
}

// 라벨은 Figma 문구 보존(검수 대기 / 진행 중 검수 / 오늘 마감 임박).
const CARDS: CardMeta[] = [
  { key: "pending", label: "검수 대기", icon: <FileText />, iconClass: "bg-gold-soft text-gold-ink" },
  { key: "inProgress", label: "진행 중 검수", icon: <Scale />, iconClass: "bg-green-soft text-green" },
  { key: "dueSoon", label: "오늘 마감 임박", icon: <AlertTriangle />, iconClass: "bg-terra-soft text-terra" },
];

export function ReviewSummaryCards() {
  const { data } = useReviewSummary();

  const counts: Record<CardMeta["key"], number> = {
    pending: data.pendingCount,
    inProgress: data.inProgressCount ?? 0,
    dueSoon: data.dueSoonCount,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="flex items-center gap-4 rounded-card-lg border border-line bg-card px-5 py-4"
        >
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-card text-xl ${card.iconClass}`}
          >
            {card.icon}
          </span>
          <span>
            <span className="block text-[0.8125rem] text-ink-3">{card.label}</span>
            <span className="mt-0.5 block text-2xl font-bold text-ink">{counts[card.key]}건</span>
          </span>
        </div>
      ))}
    </div>
  );
}

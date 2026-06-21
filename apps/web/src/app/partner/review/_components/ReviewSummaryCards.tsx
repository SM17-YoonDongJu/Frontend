"use client";

import type { ReactNode } from "react";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { FileText } from "@/shared/ui/icons/FileText";
import { Scale } from "@/shared/ui/icons/Scale";
import { useReviewSummary } from "../_api/use-review-summary";
import { useReviewFilter, type ReviewCategory } from "../_hooks/use-review-filter";

interface CardMeta {
  key: ReviewCategory;
  label: string;
  icon: ReactNode;
  iconClass: string;
}

const CARDS: CardMeta[] = [
  { key: "pending", label: "검수 대기", icon: <FileText />, iconClass: "bg-gold-soft text-gold-ink" },
  { key: "specialtyMatch", label: "내 전문분야 매칭", icon: <Scale />, iconClass: "bg-green-soft text-green" },
  { key: "dueSoon", label: "오늘 마감 임박", icon: <AlertTriangle />, iconClass: "bg-terra-soft text-terra" },
];

export function ReviewSummaryCards() {
  const { data } = useReviewSummary();
  const { active, setActive } = useReviewFilter();

  const counts: Record<ReviewCategory, number> = {
    pending: data.pendingCount,
    specialtyMatch: data.specialtyMatchCount,
    dueSoon: data.dueSoonCount,
  };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CARDS.map((card) => (
        <button
          key={card.key}
          type="button"
          onClick={() => setActive(card.key)}
          aria-pressed={active === card.key}
          className={`flex items-center gap-4 rounded-card-lg border px-5 py-4 text-left transition ${
            active === card.key ? "border-gold bg-gold-soft/30" : "border-line bg-card hover:border-gold"
          }`}
        >
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-card text-xl ${card.iconClass}`}>
            {card.icon}
          </span>
          <span>
            <span className="block text-[13px] text-ink-3">{card.label}</span>
            <span className="mt-0.5 block text-2xl font-bold text-ink">{counts[card.key]}건</span>
          </span>
        </button>
      ))}
    </div>
  );
}

"use client";

import { useReviewSummary } from "../_api/use-review-summary";
import { useReviewFilter, type ReviewCategory } from "../_hooks/use-review-filter";

const CARDS: { key: ReviewCategory; label: string }[] = [
  { key: "pending", label: "검수 대기" },
  { key: "specialtyMatch", label: "내 전문분야 매칭" },
  { key: "dueSoon", label: "마감 임박" },
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
          className={`rounded-card-lg border px-5 py-4 text-left transition ${
            active === card.key
              ? "border-gold bg-gold-soft"
              : "border-line bg-card hover:border-gold"
          }`}
        >
          <span className="text-sm text-ink-3">{card.label}</span>
          <p className="mt-1 text-2xl font-bold text-ink">{counts[card.key]}건</p>
        </button>
      ))}
    </div>
  );
}

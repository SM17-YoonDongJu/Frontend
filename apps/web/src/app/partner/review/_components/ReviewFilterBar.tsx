"use client";

import { useReviewFilter } from "../_hooks/use-review-filter";

const TYPES = ["전체", "후유장해", "교통사고", "실손"];

export function ReviewFilterBar({ regions }: { regions: string[] }) {
  const { type, region, setType, setRegion } = useReviewFilter();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TYPES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setType(t)}
          aria-pressed={type === t}
          className={`rounded-pill border px-3 py-1.5 text-sm transition ${
            type === t
              ? "border-gold bg-gold-soft text-gold-ink"
              : "border-line bg-card text-ink-2 hover:border-gold"
          }`}
        >
          {t}
        </button>
      ))}

      <select
        value={region}
        onChange={(event) => setRegion(event.target.value)}
        aria-label="지역 필터"
        className="ml-auto rounded-input border border-line bg-card px-3 py-1.5 text-sm text-ink-2"
      >
        {["전체", ...regions].map((r) => (
          <option key={r} value={r}>
            {r === "전체" ? "지역 전체" : r}
          </option>
        ))}
      </select>
    </div>
  );
}

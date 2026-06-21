"use client";

import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
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
          className={`rounded-pill border px-4 py-1.5 text-sm font-medium transition ${
            type === t
              ? "border-ink bg-ink text-white"
              : "border-line bg-card text-ink-2 hover:border-ink"
          }`}
        >
          {t}
        </button>
      ))}

      <div className="relative ml-auto flex items-center">
        <span className="pointer-events-none absolute left-3 h-1.5 w-1.5 rounded-full bg-gold" />
        <ChevronDown className="pointer-events-none absolute right-3 text-ink-3" />
        <select
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          aria-label="지역 필터"
          className="appearance-none rounded-pill border border-line bg-card py-1.5 pl-6 pr-8 text-sm text-ink-2"
        >
          {["전체", ...regions].map((r) => (
            <option key={r} value={r}>
              {r === "전체" ? "지역 전체" : r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

"use client";

import { ACCIDENT_TYPE_LABELS } from "@/shared/model/accident-type";
import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { useReviewFilter } from "../_hooks/use-review-filter";

const TYPE_OPTIONS = [
  { value: "전체", label: "전체" },
  { value: "disability", label: ACCIDENT_TYPE_LABELS.disability },
  { value: "traffic", label: ACCIDENT_TYPE_LABELS.traffic },
  { value: "medical_indemnity", label: ACCIDENT_TYPE_LABELS.medical_indemnity },
];

export function ReviewFilterBar({ regions }: { regions: string[] }) {
  const { type, region, setType, setRegion } = useReviewFilter();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TYPE_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setType(value)}
          aria-pressed={type === value}
          className={`rounded-pill border px-4 py-1.5 text-sm font-medium transition ${
            type === value
              ? "border-ink bg-ink text-white"
              : "border-line bg-card text-ink-2 hover:border-ink"
          }`}
        >
          {label}
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
          {[...new Set(["전체", ...regions])].map((r) => (
            <option key={r} value={r}>
              {r === "전체" ? "지역 전체" : r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

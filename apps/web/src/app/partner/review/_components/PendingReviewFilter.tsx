"use client";

import { cn } from "@/shared/lib/utils";
import { PENDING_FILTER_TABS } from "../_model/status-meta";

export interface PendingReviewFilterProps {
  value: string;
  onChange: (status: string) => void;
}

export function PendingReviewFilter({ value, onChange }: PendingReviewFilterProps) {
  return (
    <div role="tablist" aria-label="검수 상태 필터" className="flex flex-wrap gap-2">
      {PENDING_FILTER_TABS.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "rounded-pill border px-4 py-2 text-[13.5px] font-semibold transition",
              active
                ? "border-ink bg-ink text-white"
                : "border-line bg-card text-ink-2 hover:border-ink-3",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

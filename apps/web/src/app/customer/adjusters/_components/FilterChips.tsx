"use client";

import { cn } from "@/shared/lib/utils";
import { MOBILE_FILTER_CHIPS } from "../_model/filter-options";

interface FilterChipsProps {
  specialty: string;
  sort: string;
  onSpecialtyToggle: (specialty: string) => void;
  onSortToggle: (sort: string) => void;
}

export function FilterChips({
  specialty,
  sort,
  onSpecialtyToggle,
  onSortToggle,
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 md:hidden">
      {MOBILE_FILTER_CHIPS.map((chip) => {
        const selected =
          chip.kind === "specialty" ? specialty === chip.value : sort === chip.value;
        return (
          <button
            key={chip.label}
            type="button"
            aria-pressed={selected}
            onClick={() =>
              chip.kind === "specialty"
                ? onSpecialtyToggle(chip.value)
                : onSortToggle(chip.value)
            }
            className={cn(
              "rounded-chip border px-4 py-2 text-[0.8125rem] font-medium transition",
              selected
                ? "border-ink bg-ink text-white"
                : "border-line bg-card text-ink-2 hover:border-ink/40",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

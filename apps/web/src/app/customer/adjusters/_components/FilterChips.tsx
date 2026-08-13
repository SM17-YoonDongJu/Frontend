"use client";

import { cn } from "@/shared/lib/utils";
import { MOBILE_FILTER_CHIPS } from "../_model/filter-options";

interface FilterChipsProps {
  specialty: string;
  onSpecialtyToggle: (specialty: string) => void;
}

export function FilterChips({ specialty, onSpecialtyToggle }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2">
      {MOBILE_FILTER_CHIPS.map((chip) => {
        const selected = specialty === chip.value;
        return (
          <button
            key={chip.label}
            type="button"
            aria-pressed={selected}
            onClick={() => onSpecialtyToggle(chip.value)}
            className={cn(
              "inline-flex h-[2.625rem] shrink-0 items-center whitespace-nowrap rounded-chip border px-4 text-[0.8125rem] font-medium transition",
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

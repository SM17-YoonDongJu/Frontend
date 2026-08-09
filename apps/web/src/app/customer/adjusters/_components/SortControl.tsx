"use client";

import { SegmentedControl } from "@/shared/ui/SegmentedControl";
import { SORT_OPTIONS } from "../_model/filter-options";
import type { SortKey } from "../_model/types";

interface SortControlProps {
  sort: SortKey;
  onChange: (sort: SortKey) => void;
}

export function SortControl({ sort, onChange }: SortControlProps) {
  return (
    <SegmentedControl<SortKey>
      className="hidden md:inline-flex"
      aria-label="정렬 기준"
      size="sm"
      options={SORT_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
      value={sort}
      onChange={onChange}
    />
  );
}

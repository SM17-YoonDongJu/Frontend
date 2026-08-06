"use client";

import { formatRegionLabel, regionKey, type RegionValue } from "@/shared/model/regions";
import { Clock } from "@/shared/ui/icons/Clock";
import { X } from "@/shared/ui/icons/X";

/** 최근 선택 지역 칩. 칩 본체와 삭제 버튼을 형제로 둔다(인터랙티브 중첩 금지). */
export function RecentRegions({
  recent,
  onSelect,
  onRemove,
}: {
  recent: RegionValue[];
  onSelect: (option: RegionValue) => void;
  onRemove: (option: RegionValue) => void;
}) {
  return (
    <div className="px-3.5 pb-3">
      <p className="flex items-center gap-1.5 text-xs font-bold text-ink-3">
        <Clock className="text-[0.875rem]" />
        최근 선택
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {recent.map((option) => (
          <li
            key={regionKey(option)}
            className="flex h-8 items-center rounded-full border border-line bg-paper-2 transition hover:bg-paper"
          >
            <button
              type="button"
              onClick={() => onSelect(option)}
              className="h-full pl-3 pr-1.5 text-[0.8125rem] font-bold text-ink-2"
            >
              {formatRegionLabel(option)}
            </button>
            <button
              type="button"
              aria-label={`${formatRegionLabel(option)} 최근 선택에서 삭제`}
              onClick={() => onRemove(option)}
              className="mr-1.5 flex size-4 items-center justify-center rounded-full text-[0.75rem] text-ink-3 transition hover:text-ink"
            >
              <X />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

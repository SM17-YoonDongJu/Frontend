"use client";

import { regionKey, type RegionValue, type Sido } from "@/shared/model/regions";
import { ChevronLeft } from "@/shared/ui/icons/ChevronLeft";
import { OptionRow, type OptionProps } from "./OptionRow";

export function DistrictStep({
  sido,
  onBack,
  ...optionProps
}: OptionProps & { sido: Sido; onBack: () => void }) {
  const options: RegionValue[] = [
    { sido: sido.name, district: null },
    ...sido.districts.map((district) => ({ sido: sido.name, district })),
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col border-t border-line-2">
      <div className="flex items-center border-b border-line-2">
        <button
          type="button"
          onClick={onBack}
          className="flex h-[2.875rem] flex-1 items-center gap-2.5 px-3.5 text-left transition hover:bg-paper"
        >
          <ChevronLeft className="shrink-0 text-[1.125rem] text-ink-3" />
          <span className="font-serif text-[0.9375rem] font-bold text-ink">{sido.name}</span>
        </button>
        <span className="px-3.5 text-xs text-ink-3">시·군·구 선택</span>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto px-2 py-1.5">
        {options.map((option) => (
          <li key={regionKey(option)}>
            <OptionRow
              option={option}
              label={option.district ?? `${sido.shortName} 전체`}
              {...optionProps}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

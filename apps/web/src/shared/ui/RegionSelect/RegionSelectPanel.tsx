"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import {
  isSameRegion,
  SIDO_LIST,
  type RegionValue,
  type Sido,
} from "@/shared/model/regions";
import { Check } from "@/shared/ui/icons/Check";
import { ChevronLeft } from "@/shared/ui/icons/ChevronLeft";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";

interface RegionSelectPanelProps {
  value: RegionValue | null;
  onSelect: (value: RegionValue) => void;
}

/** 드롭다운 본체. 1단계 시·도 목록 → 2단계 시·군·구 목록. */
export function RegionSelectPanel({ value, onSelect }: RegionSelectPanelProps) {
  const [activeSido, setActiveSido] = useState<Sido | null>(null);

  if (!activeSido) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <p className="px-4 py-2.5 text-xs font-bold text-ink-3">시·도 선택</p>
        <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
          {SIDO_LIST.map((sido) => (
            <li key={sido.name}>
              <button
                type="button"
                onClick={() => setActiveSido(sido)}
                className="flex h-[2.4375rem] w-full items-center gap-2 rounded-[0.625rem] px-3.5 text-sm font-medium text-ink-2 transition hover:bg-paper"
              >
                <span className="flex-1 text-left">{sido.name}</span>
                {sido.districts.length > 0 && (
                  <span className="text-xs text-ink-3">{sido.districts.length}</span>
                )}
                <ChevronRight className="shrink-0 text-base text-ink-3" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const options: RegionValue[] = [
    { sido: activeSido.name, district: null },
    ...activeSido.districts.map((district) => ({ sido: activeSido.name, district })),
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center border-b border-line-2">
        <button
          type="button"
          onClick={() => setActiveSido(null)}
          className="flex h-[2.875rem] flex-1 items-center gap-2.5 px-3.5 text-left transition hover:bg-paper"
        >
          <ChevronLeft className="shrink-0 text-[1.125rem] text-ink-3" />
          <span className="font-serif text-[0.9375rem] font-bold text-ink">{activeSido.name}</span>
        </button>
        <span className="px-3.5 text-xs text-ink-3">시·군·구 선택</span>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto px-2 py-1.5">
        {options.map((option) => {
          const selected = value !== null && isSameRegion(value, option);
          return (
            <li key={option.district ?? "all"}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(option)}
                className={cn(
                  "flex h-[2.4375rem] w-full items-center gap-2 rounded-[0.625rem] px-3.5 text-sm transition",
                  option.district === null && "font-bold text-ink",
                  selected ? "bg-paper-2 font-bold text-ink" : "text-ink-2 hover:bg-paper",
                  !selected && option.district !== null && "font-medium",
                )}
              >
                <span className="flex-1 text-left">
                  {option.district ?? `${activeSido.shortName} 전체`}
                </span>
                {selected && <Check className="shrink-0 text-[1.0625rem] text-gold" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

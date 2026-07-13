"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import {
  formatRegionLabel,
  isSameRegion,
  regionKey,
  searchRegions,
  SIDO_LIST,
  type RegionValue,
  type Sido,
} from "@/shared/model/regions";
import { Check } from "@/shared/ui/icons/Check";
import { ChevronLeft } from "@/shared/ui/icons/ChevronLeft";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { Search } from "@/shared/ui/icons/Search";

interface RegionSelectPanelProps {
  value: RegionValue | null;
  onSelect: (value: RegionValue) => void;
}

/** 드롭다운 본체. 검색어가 있으면 통합 검색 결과, 없으면 1단계 시·도 → 2단계 시·군·구. */
export function RegionSelectPanel({ value, onSelect }: RegionSelectPanelProps) {
  const [keyword, setKeyword] = useState("");
  const [activeSido, setActiveSido] = useState<Sido | null>(null);

  const isSelected = (option: RegionValue) => value !== null && isSameRegion(value, option);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative flex items-center p-4">
        <Search className="pointer-events-none absolute left-[1.875rem] text-[1.125rem] text-ink-3" />
        <input
          type="search"
          aria-label="지역 검색"
          placeholder="시·도, 시·군·구 검색"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="h-[2.875rem] w-full rounded-[0.75rem] border border-line bg-paper-2 pl-10 pr-3.5 text-sm text-ink outline-none transition placeholder:text-ink-3 focus:border-gold focus:ring-[3px] focus:ring-gold-soft"
        />
      </div>

      {keyword.trim() ? (
        <SearchResults
          keyword={keyword}
          isSelected={isSelected}
          onSelect={onSelect}
        />
      ) : activeSido ? (
        <DistrictStep
          sido={activeSido}
          isSelected={isSelected}
          onBack={() => setActiveSido(null)}
          onSelect={onSelect}
        />
      ) : (
        <SidoStep onEnter={setActiveSido} />
      )}
    </div>
  );
}

function SidoStep({ onEnter }: { onEnter: (sido: Sido) => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col border-t border-line-2">
      <p className="px-4 py-2.5 text-xs font-bold text-ink-3">시·도 선택</p>
      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {SIDO_LIST.map((sido) => (
          <li key={sido.name}>
            <Row onClick={() => onEnter(sido)}>
              <span className="flex-1 text-left font-medium text-ink-2">{sido.name}</span>
              {sido.districts.length > 0 && (
                <span className="text-xs text-ink-3">{sido.districts.length}</span>
              )}
              <ChevronRight className="shrink-0 text-base text-ink-3" />
            </Row>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface StepProps {
  isSelected: (option: RegionValue) => boolean;
  onSelect: (option: RegionValue) => void;
}

function DistrictStep({
  sido,
  isSelected,
  onBack,
  onSelect,
}: StepProps & { sido: Sido; onBack: () => void }) {
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
        {options.map((option) => {
          const selected = isSelected(option);
          return (
            <li key={regionKey(option)}>
              <Row selected={selected} onClick={() => onSelect(option)}>
                <span
                  className={cn(
                    "flex-1 text-left",
                    selected || option.district === null
                      ? "font-bold text-ink"
                      : "font-medium text-ink-2",
                  )}
                >
                  {option.district ?? `${sido.shortName} 전체`}
                </span>
                {selected && <Check className="shrink-0 text-[1.0625rem] text-gold" />}
              </Row>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResults({ keyword, isSelected, onSelect }: StepProps & { keyword: string }) {
  const results = searchRegions(keyword);

  if (results.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center border-t border-line-2 px-4">
        <p className="text-sm text-ink-3">검색 결과가 없습니다</p>
      </div>
    );
  }

  return (
    <ul className="min-h-0 flex-1 overflow-y-auto border-t border-line-2 px-2 py-1.5">
      {results.map((option) => {
        const selected = isSelected(option);
        return (
          <li key={regionKey(option)}>
            <Row selected={selected} onClick={() => onSelect(option)}>
              <span
                className={cn(
                  "flex-1 text-left",
                  selected ? "font-bold text-ink" : "font-medium text-ink-2",
                )}
              >
                {formatRegionLabel(option)}
              </span>
              {selected && <Check className="shrink-0 text-[1.0625rem] text-gold" />}
            </Row>
          </li>
        );
      })}
    </ul>
  );
}

function Row({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex h-[2.4375rem] w-full items-center gap-2 rounded-[0.625rem] px-3.5 text-sm transition",
        selected ? "bg-paper-2" : "hover:bg-paper",
      )}
    >
      {children}
    </button>
  );
}

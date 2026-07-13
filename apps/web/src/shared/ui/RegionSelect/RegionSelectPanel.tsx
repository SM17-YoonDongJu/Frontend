"use client";

import { useState } from "react";
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
import { Checkbox } from "@/shared/ui/Checkbox";
import { Check } from "@/shared/ui/icons/Check";
import { ChevronLeft } from "@/shared/ui/icons/ChevronLeft";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { Search } from "@/shared/ui/icons/Search";

interface RegionSelectPanelProps {
  multiple: boolean;
  selected: RegionValue[];
  /** 단일 모드는 확정, 다중 모드는 토글. */
  onSelect: (option: RegionValue) => void;
}

const ROW = "flex h-[2.4375rem] w-full items-center gap-2 rounded-[0.625rem] px-3.5 text-sm transition";

/** 드롭다운 본체. 검색어가 있으면 통합 검색 결과, 없으면 1단계 시·도 → 2단계 시·군·구. */
export function RegionSelectPanel({ multiple, selected, onSelect }: RegionSelectPanelProps) {
  const [keyword, setKeyword] = useState("");
  const [activeSido, setActiveSido] = useState<Sido | null>(null);

  const optionProps = {
    multiple,
    isSelected: (option: RegionValue) => selected.some((item) => isSameRegion(item, option)),
    onSelect,
  };

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
        <SearchResults keyword={keyword} {...optionProps} />
      ) : activeSido ? (
        <DistrictStep sido={activeSido} onBack={() => setActiveSido(null)} {...optionProps} />
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
            <button type="button" onClick={() => onEnter(sido)} className={cn(ROW, "hover:bg-paper")}>
              <span className="flex-1 text-left font-medium text-ink-2">{sido.name}</span>
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

interface OptionProps {
  multiple: boolean;
  isSelected: (option: RegionValue) => boolean;
  onSelect: (option: RegionValue) => void;
}

function DistrictStep({
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

function SearchResults({ keyword, ...optionProps }: OptionProps & { keyword: string }) {
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
      {results.map((option) => (
        <li key={regionKey(option)}>
          <OptionRow option={option} label={formatRegionLabel(option)} {...optionProps} />
        </li>
      ))}
    </ul>
  );
}

/** 다중 모드는 체크박스 행, 단일 모드는 선택 시 체크 표시가 붙는 버튼 행. */
function OptionRow({
  option,
  label,
  multiple,
  isSelected,
  onSelect,
}: OptionProps & { option: RegionValue; label: string }) {
  const selected = isSelected(option);
  const text = (
    <span
      className={cn(
        "flex-1 text-left",
        selected || option.district === null ? "font-bold text-ink" : "font-medium text-ink-2",
      )}
    >
      {label}
    </span>
  );

  if (multiple) {
    return (
      <Checkbox
        checked={selected}
        onChange={() => onSelect(option)}
        label={text}
        className={cn(ROW, "gap-2.5", selected ? "bg-paper-2" : "hover:bg-paper")}
      />
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(option)}
      className={cn(ROW, selected ? "bg-paper-2" : "hover:bg-paper")}
    >
      {text}
      {selected && <Check className="shrink-0 text-[1.0625rem] text-gold" />}
    </button>
  );
}

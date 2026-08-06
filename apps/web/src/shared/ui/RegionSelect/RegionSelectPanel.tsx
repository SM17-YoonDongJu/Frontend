"use client";

import { useState } from "react";
import { isSameRegion, type RegionValue, type Sido } from "@/shared/model/regions";
import { Search } from "@/shared/ui/icons/Search";
import { DistrictStep } from "./DistrictStep";
import { RecentRegions } from "./RecentRegions";
import { SearchResults } from "./SearchResults";
import { SidoStep } from "./SidoStep";

interface RegionSelectPanelProps {
  multiple: boolean;
  selected: RegionValue[];
  recent: RegionValue[];
  /** 단일 모드는 확정, 다중 모드는 토글. */
  onSelect: (option: RegionValue) => void;
  onRemoveRecent: (option: RegionValue) => void;
}

/** 드롭다운 본체. 검색어가 있으면 통합 검색 결과, 없으면 1단계 시·도 → 2단계 시·군·구. */
export function RegionSelectPanel({
  multiple,
  selected,
  recent,
  onSelect,
  onRemoveRecent,
}: RegionSelectPanelProps) {
  const [keyword, setKeyword] = useState("");
  const [activeSido, setActiveSido] = useState<Sido | null>(null);

  const optionProps = {
    multiple,
    isSelected: (option: RegionValue) => selected.some((item) => isSameRegion(item, option)),
    onSelect,
  };

  const searching = keyword.trim().length > 0;

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

      {!searching && !activeSido && recent.length > 0 && (
        <RecentRegions recent={recent} onSelect={onSelect} onRemove={onRemoveRecent} />
      )}

      {searching ? (
        <SearchResults keyword={keyword} {...optionProps} />
      ) : activeSido ? (
        <DistrictStep sido={activeSido} onBack={() => setActiveSido(null)} {...optionProps} />
      ) : (
        <SidoStep onEnter={setActiveSido} />
      )}
    </div>
  );
}

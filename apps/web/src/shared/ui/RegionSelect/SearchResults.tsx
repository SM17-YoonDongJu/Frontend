"use client";

import { formatRegionLabel, regionKey, searchRegions } from "@/shared/model/regions";
import { OptionRow, type OptionProps } from "./OptionRow";

export function SearchResults({ keyword, ...optionProps }: OptionProps & { keyword: string }) {
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

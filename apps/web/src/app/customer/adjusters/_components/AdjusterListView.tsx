"use client";

import { useState } from "react";
import type { AdjusterListFilter } from "@/shared/api/query-keys";
import { serializeRegions, type RegionValue } from "@/shared/model/regions";
import { Button } from "@/shared/ui/Button";
import { RegionSelect } from "@/shared/ui/RegionSelect/RegionSelect";
import { useAdjusters } from "../_api/use-adjusters";
import type { SortKey } from "../_model/types";
import { AdjusterCard } from "./AdjusterCard";
import { AdjusterListEmpty } from "./AdjusterListEmpty";
import { FilterChips } from "./FilterChips";
import { FilterSidebar } from "./FilterSidebar";
import { SearchBar } from "./SearchBar";
import { SortControl } from "./SortControl";
import { StatsBand } from "./StatsBand";

const DEFAULT_SORT: SortKey = "rating";
const ALL_SPECIALTY = "전체";

export function AdjusterListView() {
  const [filter, setFilter] = useState<AdjusterListFilter>({});
  const [regions, setRegions] = useState<RegionValue[]>([]);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useAdjusters({
    ...filter,
    region: serializeRegions(regions),
  });

  const activeSpecialty = filter.specialty ?? "";
  const activeSort = (filter.sort as SortKey | undefined) ?? DEFAULT_SORT;

  // page는 infinite 쿼리의 pageParam이 관리 — 필터가 바뀌면 쿼리키 교체로 1페이지부터 다시 쌓인다
  const patch = (next: Partial<AdjusterListFilter>) =>
    setFilter((prev) => ({ ...prev, ...next }));

  const handleSearch = (keyword: string) => patch({ keyword: keyword || undefined });

  const handleSpecialtyChange = (specialty: string) => {
    const next = specialty === ALL_SPECIALTY || specialty === activeSpecialty ? undefined : specialty;
    patch({ specialty: next });
  };

  const handleSortChange = (sort: string) => patch({ sort });

  const adjusters = data.pages.flatMap((page) => page.list);
  const [firstPage] = data.pages;
  const totalCount = firstPage?.pagination.totalElements ?? adjusters.length;
  const meta = firstPage?.meta;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <header>
        <p className="hidden text-xs font-semibold tracking-[0.02rem] text-gold-ink md:block">
          전문가 찾기
        </p>
        <h1 className="mt-1 font-serif text-[1.75rem] font-semibold text-ink md:text-[2.25rem]">
          <span className="md:hidden">손해사정사 찾기</span>
          <span className="hidden md:inline">손해사정사 검색</span>
        </h1>
        <p className="mt-1.5 text-sm text-ink-3">
          <span className="md:hidden">내 사건에 맞는 전문가를 연결해드려요</span>
          <span className="hidden md:inline">
            금융감독원 등록 자격과 신원이 검증된 독립 손해사정사를 사건에 맞게 연결합니다.
          </span>
        </p>
      </header>

      {meta && (
        <div className="mt-6">
          <StatsBand meta={meta} />
        </div>
      )}

      <div className="mt-6">
        <SearchBar keyword={filter.keyword ?? ""} onSearch={handleSearch} />
      </div>

      <div className="mt-4">
        <RegionSelect mode="multiple" value={regions} onChange={setRegions} />
      </div>

      <div className="mt-3 md:hidden">
        <FilterChips
          specialty={activeSpecialty}
          sort={activeSort}
          onSpecialtyToggle={handleSpecialtyChange}
          onSortToggle={handleSortChange}
        />
      </div>

      <div className="mt-6 flex gap-6">
        <FilterSidebar
          specialty={activeSpecialty}
          list={adjusters}
          onSpecialtyChange={handleSpecialtyChange}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-4 hidden items-center justify-between md:flex">
            <p className="text-sm font-semibold text-ink">
              {totalCount}명의 손해사정사
            </p>
            <SortControl sort={activeSort} onChange={handleSortChange} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {adjusters.length === 0 ? (
              <AdjusterListEmpty />
            ) : (
              adjusters.map((adjuster) => (
                <AdjusterCard key={adjuster.adjusterId} adjuster={adjuster} />
              ))
            )}
          </div>

          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                loading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                더보기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

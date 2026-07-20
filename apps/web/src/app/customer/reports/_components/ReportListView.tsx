"use client";

import { useMemo } from "react";
import { ReportCard } from "@/app/customer/_shared/components/ReportCard";
import { useReportListInfinite } from "../_api/use-report-list-infinite";
import { ReportListEmpty } from "./ReportListEmpty";

export function ReportListView() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useReportListInfinite();

  // InfiniteData → 화면 소비용 파생값.
  const list = useMemo(() => data.pages.flatMap((page) => page.list), [data.pages]);
  // useSuspenseInfiniteQuery는 최소 1페이지 보장(initialPageParam) → totalElements는 첫 페이지 기준.
  const totalCount = data.pages[0]!.pagination.totalElements;

  return (
    <div className="mx-auto w-full max-w-[42rem] px-5 pt-6 pb-10 md:px-0 md:pt-10">
      <header className="flex items-baseline justify-between">
        <h1 className="font-serif text-[1.625rem] font-bold leading-[1.3] tracking-[-0.0144rem] text-ink">
          내 리포트
        </h1>
        <span className="text-[0.8125rem] font-semibold text-gold-ink">
          {totalCount}건
        </span>
      </header>

      {list.length === 0 ? (
        <ReportListEmpty />
      ) : (
        <>
          <ul className="mt-6 flex flex-col gap-3">
            {list.map((report) => (
              <li key={report.reportId}>
                <ReportCard report={report} />
              </li>
            ))}
          </ul>

          {hasNextPage && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full rounded-button border border-line bg-card py-3 text-[0.875rem] font-semibold text-ink-2 transition hover:brightness-[.98] disabled:cursor-not-allowed disabled:opacity-[.42]"
              >
                {isFetchingNextPage ? "불러오는 중…" : "더보기"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

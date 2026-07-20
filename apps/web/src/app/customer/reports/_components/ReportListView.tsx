"use client";

import { useMemo } from "react";
import { ReportCard } from "@/app/customer/_shared/components/ReportCard";
import { useReportListInfinite } from "../_api/use-report-list-infinite";

export function ReportListView() {
  const { data } = useReportListInfinite();

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

      <ul className="mt-6 flex flex-col gap-3">
        {list.map((report) => (
          <li key={report.reportId}>
            <ReportCard report={report} />
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { dedupeByReportId } from "@/app/customer/_shared/model/dedupe-report-list";
import { useReportListInfinite } from "../_api/use-report-list-infinite";
import { ReportListCard } from "./ReportListCard";
import { ReportListEmpty } from "./ReportListEmpty";

export function ReportListView() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useReportListInfinite();

  const list = useMemo(
    () => dedupeByReportId(data.pages.flatMap((page) => page.list)),
    [data.pages],
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[25.125rem] flex-col bg-paper md:min-h-0 md:max-w-6xl md:px-6 md:py-10">
      <div className="flex-1">
        <header className="px-5 pt-6 pb-4 md:px-0 md:pt-0 md:pb-8">
          <h1 className="font-serif text-[1.625rem] font-bold leading-[1.3] tracking-[-0.0144rem] text-ink md:text-[2rem]">
            내 리포트
          </h1>
          <p className="mt-2 text-[0.8125rem] leading-[1.45] text-ink-3 md:text-[0.9375rem]">
            분석부터 검수, 받은 제안까지 진행 상황을 한눈에 확인하세요.
          </p>
        </header>

        {list.length === 0 ? (
          <ReportListEmpty />
        ) : (
          <>
            <ul
              aria-label="리포트 목록"
              className="flex flex-col gap-3 px-5 pb-5 md:grid md:grid-cols-2 md:items-start md:gap-6 md:px-0 md:pb-8"
            >
              {list.map((report) => (
                <li key={report.reportId}>
                  <ReportListCard item={report} />
                </li>
              ))}
            </ul>

            {hasNextPage && (
              <div className="px-5 pb-4 md:mx-auto md:w-full md:max-w-[25.125rem] md:px-0 md:pb-6">
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

            <p className="px-5 pb-6 text-center text-[0.6875rem] leading-[1.5] text-ink-3 md:px-0 md:text-[0.75rem]">
              리포트를 선택하면 도착한 제안 목록으로 이동합니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { ReportCard } from "@/app/customer/_shared/components/ReportCard";
import { reportProposalsHref } from "@/app/customer/_shared/model/report-routes";
import { proposalsCtaLabel } from "@/app/customer/_shared/model/report-title";
import { useReportListInfinite } from "../_api/use-report-list-infinite";
import { ReportListEmpty } from "./ReportListEmpty";

export function ReportListView() {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useReportListInfinite();

  // InfiniteData → 화면 소비용 파생값.
  const list = useMemo(() => data.pages.flatMap((page) => page.list), [data.pages]);
  // useSuspenseInfiniteQuery는 최소 1페이지 보장(initialPageParam) → totalElements는 첫 페이지 기준.
  const totalCount = data.pages[0]!.pagination.totalElements;

  return (
    <div className="mx-auto w-full max-w-[42rem] px-5 pt-6 pb-14 md:px-0 md:pt-10">
      <header>
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-gold-ink">
          손해사정 리포트
        </p>
        <div className="mt-1.5 flex items-end justify-between gap-3">
          <h1 className="font-serif text-[1.75rem] font-bold leading-[1.2] tracking-[-0.0144rem] text-ink">
            내 리포트
          </h1>
          <span className="pb-1 text-[0.8125rem] text-ink-3">
            전체 <span className="font-semibold text-ink-2">{totalCount}</span>건
          </span>
        </div>
        <p className="mt-2 text-[0.8125rem] leading-[1.5] text-ink-3">
          분석부터 검수, 받은 제안까지 진행 상황을 한눈에 확인하세요.
        </p>
      </header>

      {list.length === 0 ? (
        <ReportListEmpty />
      ) : (
        <>
          <ul className="mt-6 flex flex-col gap-3.5">
            {list.map((report) => (
              <li key={report.reportId}>
                <ReportCard
                  report={report}
                  href={reportProposalsHref(report.reportId)}
                  ctaLabel={proposalsCtaLabel(report.proposalCount)}
                />
              </li>
            ))}
          </ul>

          {hasNextPage && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex w-full items-center justify-center gap-2 rounded-button border border-line bg-paper-2 py-3.5 text-[0.875rem] font-semibold text-ink-2 transition hover:border-gold hover:text-gold-ink disabled:cursor-not-allowed disabled:opacity-[.42]"
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

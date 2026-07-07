"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { useReportHistory } from "@/app/customer/_shared/api/use-report-history";
import { useReportHistoryFilter } from "../_hooks/use-report-history-filter";
import { CustomerReportsFilterBar } from "./CustomerReportsFilterBar";
import { CustomerReportsList } from "./CustomerReportsList";

export function CustomerReportsView() {
  const router = useRouter();
  const { status, setStatus } = useReportHistoryFilter();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useReportHistory({
    status: status ?? undefined,
  });

  const list = useMemo(() => data.pages.flatMap((page) => page.list), [data.pages]);
  // useSuspenseInfiniteQuery는 최소 1페이지 보장(initialPageParam).
  const totalCount = data.pages[0]!.pagination.totalElements;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[25.125rem] flex-col bg-paper">
      <header className="flex items-center gap-1.5 px-3 pt-4 pb-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="flex size-[2.375rem] items-center justify-center rounded-button text-ink transition hover:bg-paper-2"
        >
          <ChevronRight className="size-[1.375rem] rotate-180" />
        </button>
        <h1 className="flex-1 text-[0.9375rem] font-bold text-ink">검수 내역</h1>
        <span className="pr-1.5 text-[0.78125rem] font-bold text-gold-ink">{totalCount}건</span>
      </header>

      <CustomerReportsFilterBar />

      <CustomerReportsList
        items={list}
        totalCount={totalCount}
        hasActiveFilter={status !== null}
        onResetFilter={() => setStatus(null)}
      />

      {hasNextPage && (
        <div className="px-5 pb-6">
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
    </div>
  );
}

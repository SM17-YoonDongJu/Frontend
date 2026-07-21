"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { useReviewedReports } from "../_api/use-reviewed-reports";
import { useReviewHistoryFilter } from "../_hooks/use-review-history-filter";
import { ReviewHistoryFilterBar } from "./ReviewHistoryFilterBar";
import { ReviewHistoryList } from "./ReviewHistoryList";

export function ReviewHistoryView() {
  const router = useRouter();
  const { status, setStatus } = useReviewHistoryFilter();

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useReviewedReports({
    status: status ?? undefined,
    size: 10,
  });

  // InfiniteData → 화면 소비용 파생값. stats는 페이지 불변이라 첫 페이지 기준.
  const list = useMemo(() => data.pages.flatMap((page) => page.items), [data.pages]);
  // useSuspenseInfiniteQuery는 최소 1페이지 보장(initialPageParam).
  const stats = data.pages[0]!.stats;

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
        <span className="pr-1.5 text-[0.78125rem] font-bold text-gold-ink">
          {stats.totalCount}건
        </span>
      </header>

      <ReviewHistoryFilterBar />

      <ReviewHistoryList
        items={list}
        totalCount={stats.totalCount}
        hasActiveFilter={status !== null}
        onResetFilter={() => setStatus(null)}
      />

      {hasNextPage && (
        <div className="px-5 pb-6">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full rounded-button border border-line bg-card py-3 text-[0.875rem] font-semibold text-ink-2 transition hover:brightness-[.98] disabled:opacity-[.42] disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? "불러오는 중…" : "더보기"}
          </button>
        </div>
      )}
    </div>
  );
}

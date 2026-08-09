"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import type { ReportListInfiniteFilter } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getReportListPages } from "./get-report-list-pages";

/**
 * 내 리포트 목록(무한 조회, "더보기" 버튼 기반 page 누적, 이슈 #128).
 * staleTime 0(리스트 폴링성) / gcTime 30분. 필터(status/size)별로 캐시 분리.
 */
export function useReportListInfinite(filter?: ReportListInfiniteFilter) {
  return useSuspenseInfiniteQuery({
    queryKey: reportKeys.listInfinite(filter).queryKey,
    queryFn: ({ pageParam }) => getReportListPages(filter, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    retry: false,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

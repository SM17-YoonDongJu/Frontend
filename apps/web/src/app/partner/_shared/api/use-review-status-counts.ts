"use client";

import { useQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getReviewList } from "./get-review-list";

// 탭 배지용 상태별 건수. 무필터 목록과 쿼리키를 공유해 캐시를 재사용하고,
// Suspense 바깥(탭바)에서 소비하도록 비-suspense 쿼리로 둔다.
export function useReviewStatusCounts() {
  return useQuery({
    queryKey: reportKeys.pendingReview({}).queryKey,
    queryFn: () => getReviewList(),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
    select: (data) => data.statusCounts,
  });
}

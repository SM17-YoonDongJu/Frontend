"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { reviewKeys } from "@/shared/api/query-keys";
import { GC_TIME_DETAIL, STALE_TIME_DETAIL } from "@/shared/api/query-constants";
import { getReviewDetail } from "./get-review-detail";

export function useReviewDetail(reportId: string) {
  return useSuspenseQuery({
    queryKey: reviewKeys.detail(reportId).queryKey,
    queryFn: () => getReviewDetail(reportId),
    staleTime: STALE_TIME_DETAIL,
    gcTime: GC_TIME_DETAIL,
  });
}

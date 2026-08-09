"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getReviewSummary } from "./get-review-summary";

export function useReviewSummary() {
  return useSuspenseQuery({
    queryKey: reportKeys.pendingReviewSummary().queryKey,
    queryFn: getReviewSummary,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import type { ReviewListFilter } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getReviewList } from "../../_shared/api/get-review-list";

export function useReviewList(filter?: ReviewListFilter) {
  return useSuspenseQuery({
    queryKey: reportKeys.pendingReview(filter).queryKey,
    queryFn: () => getReviewList(filter),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

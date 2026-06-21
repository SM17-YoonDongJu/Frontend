"use client";

import { useQuery } from "@tanstack/react-query";
import {
  type PendingReviewFilter,
  reviewKeys,
} from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getPendingReviews } from "./get-pending-reviews";

export function usePendingReviews(filter?: PendingReviewFilter) {
  return useQuery({
    queryKey: reviewKeys.pending(filter).queryKey,
    queryFn: () => getPendingReviews(filter),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

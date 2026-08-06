"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getActivitySummary } from "./get-activity-summary";

export function useActivitySummary() {
  return useSuspenseQuery({
    queryKey: userKeys.activitySummary.queryKey,
    queryFn: getActivitySummary,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

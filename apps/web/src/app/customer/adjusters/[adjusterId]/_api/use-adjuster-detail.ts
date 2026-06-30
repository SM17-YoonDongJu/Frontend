"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { adjusterKeys } from "@/shared/api/query-keys";
import { GC_TIME_DETAIL, STALE_TIME_DETAIL } from "@/shared/api/query-constants";
import { getAdjusterDetail } from "./get-adjuster-detail";

export function useAdjusterDetail(adjusterId: string) {
  return useSuspenseQuery({
    queryKey: adjusterKeys.detail(adjusterId).queryKey,
    queryFn: () => getAdjusterDetail(adjusterId),
    staleTime: STALE_TIME_DETAIL,
    gcTime: GC_TIME_DETAIL,
    retry: false,
  });
}

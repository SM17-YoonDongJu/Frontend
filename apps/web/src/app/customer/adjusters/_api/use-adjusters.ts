"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { adjusterKeys, type AdjusterListFilter } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getAdjusters } from "./get-adjusters";

export function useAdjusters(filter: AdjusterListFilter = {}) {
  return useSuspenseQuery({
    queryKey: adjusterKeys.list(filter).queryKey,
    queryFn: () => getAdjusters(filter),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
    retry: false,
  });
}

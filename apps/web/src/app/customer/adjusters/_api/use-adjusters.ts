"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { adjusterKeys, type AdjusterListFilter } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getAdjusters } from "./get-adjusters";

export function useAdjusters(filter: AdjusterListFilter = {}) {
  return useSuspenseInfiniteQuery({
    queryKey: adjusterKeys.list(filter).queryKey,
    queryFn: ({ pageParam }) => getAdjusters({ ...filter, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
    retry: false,
  });
}

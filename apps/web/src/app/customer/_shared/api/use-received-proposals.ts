"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getReceivedProposals } from "./get-received-proposals";

/**
 * 고객이 받은 제안 목록(무한 조회, "더보기" 버튼 기반 page 누적).
 * staleTime 0(리스트 폴링성) / gcTime 30분.
 */
export function useReceivedProposals() {
  return useSuspenseInfiniteQuery({
    queryKey: reportKeys.receivedProposals.queryKey,
    queryFn: ({ pageParam }) => getReceivedProposals(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    retry: false,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

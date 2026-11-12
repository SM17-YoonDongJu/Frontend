"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import type { ReviewListFilter } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getReviewList } from "../../_shared/api/get-review-list";

const FIRST_PAGE = 1;
const PAGE_SIZE = 20;

/**
 * 검수 대기 목록(무한 조회, "더보기" 버튼 기반 page 누적).
 * 이 API의 page는 요청·응답 모두 1부터다(검수 내역은 0부터라 pageParam 기준이 다르다).
 * 응답의 hasNext가 다음 페이지 유무의 기준이다 — 건수가 많은 계정에서 첫 페이지만 보이던 문제(#326).
 */
export function useReviewListInfinite(filter?: Omit<ReviewListFilter, "page" | "size">) {
  return useSuspenseInfiniteQuery({
    queryKey: reportKeys.pendingReviewInfinite(filter).queryKey,
    queryFn: ({ pageParam }) => getReviewList({ ...filter, page: pageParam, size: PAGE_SIZE }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

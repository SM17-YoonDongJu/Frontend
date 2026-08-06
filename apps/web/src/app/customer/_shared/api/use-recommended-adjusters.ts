"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { adjusterKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getAdjusters } from "./get-adjusters";
import type { AdjusterListItem } from "../model/adjuster-list.schema";

/**
 * 홈 추천 손해사정사 — GET /adjusters 첫 페이지를 평점순으로 반환(이슈 #142).
 * 온보딩·추천 카드가 소비처별로 slice(4/3). 목록 화면(useAdjusters, 무한 조회)과 캐시 분리.
 */
export function useRecommendedAdjusters(): AdjusterListItem[] {
  const { data } = useSuspenseQuery({
    queryKey: adjusterKeys.recommended.queryKey,
    queryFn: () => getAdjusters({ sort: "rating", size: 4 }),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
  return data.list;
}

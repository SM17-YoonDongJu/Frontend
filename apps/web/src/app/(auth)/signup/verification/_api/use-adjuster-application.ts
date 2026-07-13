"use client";

import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getAdjusterApplication } from "./get-adjuster-application";

// 상태 조회 훅(GET .../me).
// - data: AdjusterApplicationStatus | null (null = 404 → NOT_APPLIED, 신청 이력 없음)
// - isError/error: 401 LOGIN_REQUIRED(error.name) 또는 5xx
// - staleTime 0 + refetchOnWindowFocus: 심사중 상태(PENDING→APPROVED/REJECTED) 실시간 반영(폴링성)
// - retry:false: POST_NOT_FOUND(404)는 정상 분기라 재시도 금지
export function useAdjusterApplication() {
  return useQuery({
    queryKey: userKeys.adjusterApplication.queryKey,
    queryFn: getAdjusterApplication,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
    retry: false,
    refetchOnWindowFocus: true,
  });
}

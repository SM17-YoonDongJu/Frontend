"use client";

import { useQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getReportList } from "./get-report-list";

/**
 * 대시보드 BFF의 activeReport에는 분석 상태가 없어, 같은 목록 캐시에서 그 건의 analysisState를 찾는다.
 * 보조 정보라 suspense로 묶지 않는다 — 목록을 못 받거나 첫 페이지에 없으면 undefined(중립 문구로 폴백).
 */
export function useReportAnalysisState(reportId: string | null) {
  return useQuery({
    queryKey: reportKeys.list(undefined).queryKey,
    queryFn: () => getReportList(),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
    enabled: reportId != null,
    select: (list) => list.list.find((item) => item.reportId === reportId)?.analysisState,
  }).data;
}

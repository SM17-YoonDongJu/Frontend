"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import { GC_TIME_DETAIL, STALE_TIME_DETAIL } from "@/shared/api/query-constants";
import { getReportDetail } from "./get-report-detail";

const ANALYSIS_POLL_MS = 5_000;

/**
 * 최종 채택(reviewedAt) 전 상세는 확정본이 아니라 진입할 때마다 다시 받고(staleTime 0),
 * 분석 중(PROCESSING)에는 끝날 때까지 폴링해 새로고침 없이 본문으로 바뀌게 한다.
 */
export function useReportDetail(reportId: string) {
  return useSuspenseQuery({
    queryKey: reportKeys.detail(reportId).queryKey,
    queryFn: () => getReportDetail(reportId),
    staleTime: (query) => (query.state.data?.reviewedAt != null ? STALE_TIME_DETAIL : 0),
    refetchInterval: (query) =>
      query.state.data?.analysisState === "PROCESSING" ? ANALYSIS_POLL_MS : false,
    gcTime: GC_TIME_DETAIL
  });
}

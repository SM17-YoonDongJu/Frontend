"use client";

import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ERROR_CODES,
  getErrorCode,
  isAuthRedirectError,
  isRetryableError,
} from "@/shared/api/error-codes";
import { GC_TIME_DETAIL, STALE_TIME_DETAIL } from "@/shared/api/query-constants";
import { reportKeys } from "@/shared/api/query-keys";
import { getReportAnalysisMetrics } from "./get-report-analysis-metrics";

/** 기본(3회)보다 짧게 — 보조 패널이고, LOW 등급 문구를 보류하는 시간(#324 D4)을 줄인다. */
const ANALYSIS_METRICS_MAX_RETRIES = 1;

/** 상세와 같은 분기(ReportDetailBoundary)로 올릴 에러 — 인가·존재·인증. 나머지(네트워크·5xx·parse)는 패널 안에서 처리. */
const DETAIL_BOUNDARY_ERROR_CODES: ReadonlySet<string> = new Set([
  ERROR_CODES.FORBIDDEN,
  ERROR_CODES.REPORT_NOT_FOUND,
  ERROR_CODES.POST_NOT_FOUND,
  ERROR_CODES.EXPIRED_TOKEN,
]);

function shouldThrowToDetailBoundary(error: unknown): boolean {
  if (isAuthRedirectError(error)) return true; // LOGIN_REQUIRED·INVALID_TOKEN·REFRESH_TOKEN_NOT_FOUND
  const code = getErrorCode(error);
  return code !== null && DETAIL_BOUNDARY_ERROR_CODES.has(code);
}

/**
 * 조회와 prefetch가 같은 키·정책을 쓰도록 한 곳에서 정한다.
 * - staleTime: 수치가 있으면(available) 확정본이라 다시 받지 않고, 없으면 진입할 때마다 다시 확인한다.
 * - retry: 네트워크·5xx만 1회.
 */
function reportAnalysisMetricsQueryOptions(reportId: string) {
  return queryOptions({
    queryKey: reportKeys.analysisMetrics(reportId).queryKey,
    queryFn: () => getReportAnalysisMetrics(reportId),
    staleTime: (query) => (query.state.data?.available === true ? STALE_TIME_DETAIL : 0),
    gcTime: GC_TIME_DETAIL,
    retry: (failureCount, error) =>
      failureCount < ANALYSIS_METRICS_MAX_RETRIES && isRetryableError(error),
  });
}

/**
 * 리포트 AI 분석 근거 수치(#324). 상세 본문과 suspense로 묶지 않는다 — 늦거나 실패해도 본문이 먼저 그려진다.
 * 화면에 내려줄 때는 toAnalysisMetricsState로 상태를 정한다(데이터 우선).
 * - enabled: 상세 본문을 보여줄 단계(showBody)에서만 화면에 쓴다(요청 시작은 usePrefetchReportAnalysisMetrics).
 * - throwOnError: 아직 받은 수치가 없을 때 인가·존재·인증 에러만 상세 경계로 올린다(상세와 같은 화면).
 */
export function useReportAnalysisMetrics(reportId: string, options: { enabled: boolean }) {
  return useQuery({
    ...reportAnalysisMetricsQueryOptions(reportId),
    enabled: options.enabled,
    throwOnError: (error, query) =>
      query.state.data === undefined && shouldThrowToDetailBoundary(error),
  });
}

/**
 * 상세 조회와 동시에 수치를 받기 시작한다. 상세가 끝난 뒤에야 요청하면 사유 박스가 본문보다 한 박자 늦게 붙어
 * 아래 내용을 밀어낸다(모바일 약 13rem). 상세 suspense 경계 바깥에서 부른다.
 * 하이드레이션 뒤(effect)에만 요청해 서버 렌더에서는 부르지 않고, 결과 처리는 useReportAnalysisMetrics가 맡는다.
 */
export function usePrefetchReportAnalysisMetrics(reportId: string) {
  const queryClient = useQueryClient();
  useEffect(() => {
    void queryClient.prefetchQuery(reportAnalysisMetricsQueryOptions(reportId));
  }, [queryClient, reportId]);
}

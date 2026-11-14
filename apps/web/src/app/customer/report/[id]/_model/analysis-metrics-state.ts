import type { ReportAnalysisMetrics } from "./types";

/**
 * 분석 근거 수치를 화면이 어떻게 다룰지(#324 D7). 패널과 등급 문구가 같은 판정을 쓰도록 한 곳에서 정한다.
 * - loading: 아직 응답 전(재시도 중 포함)
 * - hidden: NO_DRAFT — 패널 숨김
 * - legacy: LEGACY_REPORT — 수치가 없는 리포트라는 중립 문구
 * - unavailable: UNAVAILABLE·모르는 사유값·쿼리 실패 — 불러올 수 없다는 문구
 * - ready: 수치 있음
 */
export type AnalysisMetricsState =
  | { status: "loading" }
  | { status: "hidden" }
  | { status: "legacy" }
  | { status: "unavailable" }
  | { status: "ready"; metrics: ReportAnalysisMetrics };

/**
 * useQuery 결과를 그대로 받는다(구조적 타입). 데이터 우선 — 받은 수치가 있으면 백그라운드 재조회가
 * 실패해도 마지막 수치를 그대로 보여 준다.
 */
export function toAnalysisMetricsState(query: {
  status: "pending" | "error" | "success";
  data: ReportAnalysisMetrics | undefined;
  isFetching: boolean;
}): AnalysisMetricsState {
  const { data } = query;
  if (data === undefined) {
    return query.status === "pending" ? { status: "loading" } : { status: "unavailable" };
  }
  if (data.available) return { status: "ready", metrics: data };

  switch (data.unavailableReason) {
    case "NO_DRAFT":
      // 분석 중에 prefetch로 받은 "초안 없음"을 분석이 끝난 뒤 다시 확인하는 동안은 로딩으로 본다 —
      // 패널이 숨었다 나타나거나 LOW 문구가 먼저 보였다 바뀌지 않게(D4).
      return query.isFetching ? { status: "loading" } : { status: "hidden" };
    case "LEGACY_REPORT":
      return { status: "legacy" };
    default:
      // UNAVAILABLE·모르는 값(UNKNOWN)·사유 없음(null)
      return { status: "unavailable" };
  }
}

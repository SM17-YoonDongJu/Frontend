/**
 * 고객 리포트 관련 라우트 경로(대시보드·내 리포트 목록 등 여러 세그먼트 공유).
 * 리포트 카드가 세그먼트 내부(_model)에 의존하지 않도록 _shared 정본으로 둔다.
 */
export const reportDetailHref = (reportId: string) => `/customer/report/${reportId}`;

/** 그 건에 도착한 사정사 제안 목록 페이지 — 내 리포트 목록 카드의 이동 목적지. */
export const reportProposalsHref = (reportId: string) => `/customer/proposals/${reportId}`;

/** 새 분석(손해사정 요청) 시작 진입 경로 — 대시보드·내 리포트 빈 상태 CTA 공유. */
export const NEW_ANALYSIS_HREF = "/customer/adjust-request";

/**
 * 리포트 카드의 이동 목적지. 받은 제안이 있으면 제안 목록, 없으면 리포트 상세(AI 분석 결과)로 보낸다.
 * 제안 0건인 검수 전 리포트도 분석 결과를 바로 볼 수 있어야 한다.
 */
export const reportEntryHref = (report: { reportId: string; proposalCount: number }) =>
  report.proposalCount > 0
    ? reportProposalsHref(report.reportId)
    : reportDetailHref(report.reportId);

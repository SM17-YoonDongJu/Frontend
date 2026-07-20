/**
 * 고객 리포트 관련 라우트 경로(대시보드·내 리포트 목록 등 여러 세그먼트 공유).
 * 리포트 카드가 세그먼트 내부(_model)에 의존하지 않도록 _shared 정본으로 둔다.
 */
export const reportDetailHref = (reportId: string) => `/customer/report/${reportId}`;

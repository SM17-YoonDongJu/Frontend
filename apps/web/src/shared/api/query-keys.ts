import { createQueryKeys } from "@lukemorales/query-key-factory";

export interface ReportListFilter {
  status?: string;
  page?: number;
}

export interface ReviewListFilter {
  status?: string;
  accidentType?: string;
  region?: string;
  page?: number;
  size?: number;
}

// 검수 내역(이슈 #59). page는 useInfiniteQuery의 pageParam이 관리 → 키에서 제외.
export interface ReviewedReportsFilter {
  status?: string;
  month?: string;
  size?: number;
}

export const reportKeys = createQueryKeys("report", {
  list: (filter?: ReportListFilter) => [{ filter: filter ?? {} }],
  // 고객이 받은 제안 목록(이슈 #78). page는 useInfiniteQuery의 pageParam이 관리 → 파라미터 없음.
  receivedProposals: null,
  detail: (reportId: string) => [reportId],
  pendingReview: (filter?: ReviewListFilter) => [{ filter: filter ?? {} }],
  pendingReviewSummary: () => ["summary"],
  // 검수 대기 PC 프리뷰 패널 전용(고객 상세 detail 키와 스키마가 달라 캐시 분리).
  draftPreview: (reportId: string) => [reportId],
  reviewedReports: (filter?: ReviewedReportsFilter) => [{ filter: filter ?? {} }],
});

export const userKeys = createQueryKeys("user", {
  me: null,
  // 고객 마이페이지(이슈 #105) — 활동 카운트·보험 목록. insurance 도메인 미신설(user 배치).
  activitySummary: null,
  insurances: null,
  // 손해사정사 자격 신청 상태(이슈 #44) — GET /users/adjuster-applications/me
  adjusterApplication: null,
});

export const authKeys = createQueryKeys("auth", {
  oauthCallback: (provider: string, code: string) => [provider, code],
});

export const settingsKeys = createQueryKeys("settings", {
  notification: null,
});

export const proposalKeys = createQueryKeys("proposal", {
  list: (reportId: string) => [reportId],
});

export const reviewKeys = createQueryKeys("review", {
  detail: (reportId: string) => [reportId],
});

export const chatKeys = createQueryKeys("chat", {
  list: null,
  messages: (chatRoomId: string) => [chatRoomId],
});

export const notificationKeys = createQueryKeys("notification", {
  list: null,
});

export interface AdjusterListFilter {
  keyword?: string;
  specialty?: string;
  region?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export const adjusterKeys = createQueryKeys("adjuster", {
  meProfile: () => ["me", "profile"],
  // 헤더/인사말용 축약 프로필 — meProfile(전체 프로필)과 응답 shape가 달라 키 분리
  meProfileSummary: () => ["me", "profile", "summary"],
  dashboard: () => ["dashboard"],
  inProgress: () => ["in-progress"],
  mypage: () => ["me", "mypage"],
  list: (filter?: AdjusterListFilter) => [{ filter: filter ?? {} }],
  detail: (adjusterId: string) => [adjusterId],
});

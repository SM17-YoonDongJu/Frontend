import { createQueryKeys } from "@lukemorales/query-key-factory";

export interface ReportListFilter {
  status?: string;
  page?: number;
}

export interface ReviewListFilter {
  status?: string;
  accidentType?: string;
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
  detail: (reportId: string) => [reportId],
  pendingReview: (filter?: ReviewListFilter) => [{ filter: filter ?? {} }],
  pendingReviewSummary: () => ["summary"],
  reviewedReports: (filter?: ReviewedReportsFilter) => [{ filter: filter ?? {} }],
});

export const userKeys = createQueryKeys("user", {
  me: null,
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

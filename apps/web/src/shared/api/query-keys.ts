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

export const reportKeys = createQueryKeys("report", {
  list: (filter?: ReportListFilter) => [{ filter: filter ?? {} }],
  detail: (reportId: string) => [reportId],
  pendingReview: (filter?: ReviewListFilter) => [{ filter: filter ?? {} }],
  pendingReviewSummary: () => ["summary"],
});

export const userKeys = createQueryKeys("user", {
  me: null,
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
  list: (filter?: AdjusterListFilter) => [{ filter: filter ?? {} }],
  detail: (adjusterId: string) => [adjusterId],
});

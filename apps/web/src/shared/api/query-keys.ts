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

export const authKeys = createQueryKeys("auth", {
  oauthCallback: (provider: string, code: string) => [provider, code],
});

export const proposalKeys = createQueryKeys("proposal", {
  list: (reportId: string) => [reportId],
});

export const reviewKeys = createQueryKeys("review", {
  detail: (reportId: string) => [reportId],
});

export const adjusterKeys = createQueryKeys("adjuster", {
  meProfile: () => ["me", "profile"],
  dashboard: () => ["dashboard"],
  inProgress: () => ["in-progress"],
  detail: (adjusterId: string) => [adjusterId],
});

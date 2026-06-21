import { createQueryKeys } from "@lukemorales/query-key-factory";

export interface ReportListFilter {
  status?: string;
  page?: number;
}

export interface ReviewListFilter {
  status?: string;
  page?: number;
  size?: number;
}

export const reportKeys = createQueryKeys("report", {
  list: (filter?: ReportListFilter) => [{ filter: filter ?? {} }],
  detail: (reportId: string) => [reportId],
  pendingReview: (filter?: ReviewListFilter) => [{ filter: filter ?? {} }],
  pendingReviewSummary: () => ["summary"],
});

export const proposalKeys = createQueryKeys("proposal", {
  list: (reportId: string) => [reportId],
});

export interface PendingReviewFilter {
  status?: string;
  page?: number;
  size?: number;
}

export const reviewKeys = createQueryKeys("review", {
  pending: (filter?: PendingReviewFilter) => [{ filter: filter ?? {} }],
  detail: (reportId: string) => [reportId],
});

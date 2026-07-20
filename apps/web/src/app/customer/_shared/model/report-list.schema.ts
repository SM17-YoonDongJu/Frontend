import { z } from "zod";

/**
 * 고객 검수 내역/받은 제안 목록 정본(이슈 #78 전용).
 * 대시보드의 report-list.schema.ts와 별도 — 이 화면만의 확장 필드(title, confirmed 범위, rating)를 포함.
 * 봉투(status/message/code)는 fetchJson이 해제 — 여기선 data 페이로드만 모델링.
 */
export const reportListStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "CLOSED",
]);

export const reportListItemSchema = z.object({
  reportId: z.uuid(),
  status: reportListStatusSchema,
  accidentType: z.string(),
  createdAt: z.string(),
  reportNo: z.string(),
  claimedMinAmount: z.number().int().nonnegative(),
  claimedMaxAmount: z.number().int().nonnegative(),
  proposalCount: z.number().int(),
  reviewedAt: z.string().nullable(),
  adjusterNickname: z.string().nullable(),

  // 🏷확인필요(FE) list 확장 — optional, MSW로만 채움(노션 명세 반영됨).
  title: z.string().optional(),
  confirmedMinAmount: z.number().int().nullable().optional(),
  confirmedMaxAmount: z.number().int().nullable().optional(),
  rating: z.number().nullable().optional(),
  // 받은 제안 목록 "NEW N" 배지용 신규 도착 제안 수(이슈 #78).
  newProposalCount: z.number().int().optional(),
});

export const paginationSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  hasNext: z.boolean(),
});

export const reportListSchema = z.object({
  list: z.array(reportListItemSchema),
  pagination: paginationSchema,
});

export type ReportListItemStatus = z.infer<typeof reportListStatusSchema>;
export type ReportListItem = z.infer<typeof reportListItemSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type ReportListResponse = z.infer<typeof reportListSchema>;

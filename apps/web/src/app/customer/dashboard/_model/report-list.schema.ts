import { z } from "zod";

export const reportStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "MATCHED",
]);

// CONTRACT(naming-dictionary §9 드리프트, MSW 선반영 / 백엔드 list 응답 확장 요청):
// reportNo·claimedMin/MaxAmount·proposalCount·reviewedAt·adjusterNickname.
export const reportListItemSchema = z.object({
  reportId: z.uuid(),
  status: reportStatusSchema,
  accidentType: z.string(),
  createdAt: z.string(),
  reportNo: z.string(),
  claimedMinAmount: z.number().int().nonnegative(),
  claimedMaxAmount: z.number().int().nonnegative(),
  proposalCount: z.number().int(),
  reviewedAt: z.string().nullable(),
  adjusterNickname: z.string().nullable(),
  // CONTRACT(naming-dictionary §확정 #24 / list 응답 미포함, FE 임시 추가 — 드리프트 항목 10): offeredAmount 보험사 제안금액.
  offeredAmount: z.number().int().nonnegative().nullable(),
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

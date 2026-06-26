import { z } from "zod";

/** 검수 대기 목록. 출처: API 명세 GET /reports/pending-review. 필드명 명세 그대로. */

export const reviewStatusSchema = z.enum(["AWAITING_INSPECTION", "COUNSELING"]);

export const reviewListItemSchema = z.object({
  reportId: z.uuid(),
  accidentType: z.string(),
  status: reviewStatusSchema,
  createdAt: z.string(),
  // 디자인용 카드 확장 필드 — 명세 list 응답에 없음(백엔드 확정 전까지 optional).
  caseId: z.string().optional(),
  title: z.string().optional(),
  region: z.string().optional(),
  claimedMinAmount: z.number().int().optional(),
  claimedMaxAmount: z.number().int().optional(),
  offerHeadroom: z.number().int().optional(),
  issueCount: z.number().int().optional(),
  held: z.boolean().optional(),
});

/** 보류 처리 응답. ⚠️ API 명세 미정(드리프트) — 목업. */
export const holdReviewSchema = z.object({
  reportId: z.uuid(),
  held: z.boolean(),
});

export const paginationSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  hasNext: z.boolean(),
});

export const reviewListSchema = z.object({
  list: z.array(reviewListItemSchema),
  pagination: paginationSchema,
});

/** 검수 현황 요약. ⚠️ API 명세 미정(드리프트) — 목업 사용, 백엔드 확인 필요. */
export const reviewSummarySchema = z.object({
  pendingCount: z.number().int(),
  specialtyMatchCount: z.number().int(),
  dueSoonCount: z.number().int(),
});

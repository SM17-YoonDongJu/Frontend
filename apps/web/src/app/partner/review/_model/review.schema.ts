import { z } from "zod";

/** 검수 대기 목록. 출처: API 명세 GET /reports/pending-review. 필드명 명세 그대로. */

export const reviewStatusSchema = z.enum(["AWAITING_INSPECTION", "COUNSELING"]);

export const reviewListItemSchema = z.object({
  reportId: z.uuid(),
  accidentType: z.string(),
  status: reviewStatusSchema,
  createdAt: z.string(),
  // ⚠️ API 명세 미정(드리프트) — 디자인 요구 카드 필드. 백엔드에 list 확장 요청.
  caseId: z.string(),
  title: z.string(),
  region: z.string(),
  matchingScore: z.number().int(),
  claimedMinAmount: z.number().int(),
  claimedMaxAmount: z.number().int(),
  offerHeadroom: z.number().int(),
  issueCount: z.number().int(),
  held: z.boolean(),
  // ⚠️ API 명세 미정(드리프트) — 대시보드 검수 마감일(ISO date). 백엔드 list 확장 요청.
  reviewDeadline: z.string(),
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

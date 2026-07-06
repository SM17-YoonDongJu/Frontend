import { z } from "zod";

/** 검수 대기 목록. 출처: API 명세 GET /reports/pending-review. 필드명 명세 그대로. */

export const reviewStatusSchema = z.enum(["AWAITING_INSPECTION", "COUNSELING"]);

export const reviewListItemSchema = z.object({
  // 명세 확정 4필드 (naming-dictionary §7-6)
  reportId: z.uuid(),
  accidentType: z.string(),
  status: reviewStatusSchema,
  createdAt: z.string(),
  // CONTRACT: 명세없음-임시 — Figma 카드 요구 필드. list 미확장으로 FE optional + MSW 목킹.
  caseId: z.string().optional(),
  title: z.string().optional(),
  region: z.string().optional(),
  claimedMinAmount: z.number().int().optional(),
  claimedMaxAmount: z.number().int().optional(),
  // CONTRACT: 명세없음-임시 — "제안 대비 +N만" 표시치. 백엔드 확장 시 정식 필드명 확인 대상.
  offerHeadroom: z.number().int().optional(),
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

/** 검수 현황 요약. 하단 탭바 뱃지 카운트용. */
export const reviewSummarySchema = z.object({
  pendingCount: z.number().int(),
  specialtyMatchCount: z.number().int(),
  dueSoonCount: z.number().int(),
});

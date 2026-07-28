import { z } from "zod";

/** 검수 현황 요약. 하단 탭바 뱃지 카운트 + PC 요약 카드용. */
export const reviewSummarySchema = z.object({
  pendingCount: z.number().int(),
  // CONTRACT: 명세없음-임시 — 전문분야 일치 건수. 백엔드 협의 중.
  specialtyMatchCount: z.number().int().nullish(),
  dueSoonCount: z.number().int(),
  // CONTRACT: 명세없음-임시 — PC 요약 카드 "진행 중 검수" 건수. 백엔드 협의 중.
  inProgressCount: z.number().int().optional(),
});

/** 보류 사유. 출처: API 명세 POST /reports/{reportId}/hold body.reason. */
export const holdReasonSchema = z.enum([
  "NEED_MORE_DOCUMENTS",
  "OUT_OF_SPECIALTY",
  "SCHEDULE_CONFLICT",
  "OTHER",
]);

/** 보류 응답(멱등). 출처: API 명세 POST /reports/{reportId}/hold. */
export const holdReviewSchema = z.object({
  reportId: z.uuid(),
  held: z.boolean(),
  reason: holdReasonSchema,
  reasonDetail: z.string().nullable(),
});

export type HoldReason = z.infer<typeof holdReasonSchema>;
export type HoldReview = z.infer<typeof holdReviewSchema>;

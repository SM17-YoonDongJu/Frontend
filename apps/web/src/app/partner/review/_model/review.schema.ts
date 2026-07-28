import { z } from "zod";

// 백엔드 PendingReviewSummaryResponse 기준(4필드 전부 long, 항상 present).
export const reviewSummarySchema = z.object({
  pendingCount: z.number().int(),
  dueSoonCount: z.number().int(),
  inProgressCount: z.number().int(),
  specialtyMatchCount: z.number().int(),
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

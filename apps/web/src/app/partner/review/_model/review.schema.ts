import { z } from "zod";

/** 검수 현황 요약. 하단 탭바 뱃지 카운트 + PC 요약 카드용. */
export const reviewSummarySchema = z.object({
  pendingCount: z.number().int(),
  specialtyMatchCount: z.number().int(),
  dueSoonCount: z.number().int(),
  // CONTRACT: 명세없음-임시 — PC 요약 카드 "진행 중 검수" 건수. 백엔드 협의 중.
  inProgressCount: z.number().int().optional(),
});

/** 보류 토글 응답. 출처: API 명세 PATCH /reports/{reportId}/hold. */
export const holdReviewSchema = z.object({
  reportId: z.uuid(),
  held: z.boolean(),
});

export type HoldReview = z.infer<typeof holdReviewSchema>;

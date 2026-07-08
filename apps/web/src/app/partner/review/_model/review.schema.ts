import { z } from "zod";

/** 검수 현황 요약. 하단 탭바 뱃지 카운트용. */
export const reviewSummarySchema = z.object({
  pendingCount: z.number().int(),
  specialtyMatchCount: z.number().int(),
  dueSoonCount: z.number().int(),
});

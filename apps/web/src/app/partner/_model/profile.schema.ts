import { z } from "zod";

/** 손해사정사 본인 프로필(대시보드 헤더·인사말). 출처: GET /adjusters/me/profile. */
export const adjusterProfileSchema = z.object({
  adjusterId: z.uuid(),
  nickname: z.string(),
  averageRating: z.number(),
  reviewCount: z.number().int(),
  // 백엔드 AdjusterMyProfileResponse.pendingReviewCount(long, 항상 present).
  pendingReviewCount: z.number().int(),
});

import { z } from "zod";

/** 손해사정사 본인 프로필(대시보드 헤더·인사말). 출처: GET /adjusters/me/profile. */
export const adjusterProfileSchema = z.object({
  adjusterId: z.uuid(),
  nickname: z.string(),
  averageRating: z.number(),
  reviewCount: z.number().int(),
  // ⚠️ API 명세 미정(드리프트) — 헤더/인사말 검수 대기 빠른 카운트. 백엔드 확장 요청.
  pendingReviewCount: z.number().int(),
});

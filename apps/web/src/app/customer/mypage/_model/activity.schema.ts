import { z } from "zod";

// CONTRACT(명세없음-임시, 이슈 #105): 활동 카운트 집계 GET /users/me/activity-summary.
// 전용 엔드포인트 부재 — 초안 .pr-assets/api-spec-draft-user-mypage.md. closedCount(종결) 정의·소스 백엔드 확인.
export const activitySummarySchema = z.object({
  reportCount: z.number().int().nonnegative(),
  proposalCount: z.number().int().nonnegative(),
  consultCount: z.number().int().nonnegative(),
  closedCount: z.number().int().nonnegative(),
});

export type ActivitySummary = z.infer<typeof activitySummarySchema>;

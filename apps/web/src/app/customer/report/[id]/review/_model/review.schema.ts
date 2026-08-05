import { z } from "zod";
import { CreateAdjusterReviewRequestSchema } from "@/shared/api/generated/zod.gen";

// 생성 스키마 그대로 사용 — 별점 1~5 범위·후기 길이 제약 다 일치.
export const createReviewSchema = CreateAdjusterReviewRequestSchema;

export type CreateReviewBody = z.infer<typeof createReviewSchema>;

export const reviewResultSchema = z.object({
  reviewId: z.uuid(),
  adjusterId: z.uuid(),
  score: z.number().int().min(1).max(5),
  createdAt: z.string(),
});

export type ReviewResult = z.infer<typeof reviewResultSchema>;

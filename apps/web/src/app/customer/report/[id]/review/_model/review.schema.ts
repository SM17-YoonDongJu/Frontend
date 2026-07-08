import { z } from "zod";

export const createReviewSchema = z.object({
  score: z.number().int().min(1).max(5),
  content: z.string().max(1000).optional(),
});

export type CreateReviewBody = z.infer<typeof createReviewSchema>;

export const reviewResultSchema = z.object({
  reviewId: z.uuid(),
  adjusterId: z.uuid(),
  score: z.number().int().min(1).max(5),
  createdAt: z.string(),
});

export type ReviewResult = z.infer<typeof reviewResultSchema>;

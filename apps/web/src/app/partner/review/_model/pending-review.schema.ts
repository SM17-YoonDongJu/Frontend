import { z } from "zod";

export const pendingReviewStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "MATCHED",
]);

export const pendingReviewItemSchema = z.object({
  reportId: z.uuid(),
  caseId: z.string().optional(),
  accidentType: z.string(),
  status: pendingReviewStatusSchema,
  createdAt: z.string(),
});

export const paginationSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  hasNext: z.boolean(),
});

export const pendingReviewPageSchema = z.object({
  list: z.array(pendingReviewItemSchema),
  pagination: paginationSchema,
});

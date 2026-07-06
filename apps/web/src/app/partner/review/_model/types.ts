import type { z } from "zod";
import type {
  reviewStatusSchema,
  reviewListItemSchema,
  paginationSchema,
  reviewListSchema,
  reviewSummarySchema,
} from "./review.schema";

export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type ReviewListItem = z.infer<typeof reviewListItemSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type ReviewList = z.infer<typeof reviewListSchema>;
export type ReviewSummary = z.infer<typeof reviewSummarySchema>;

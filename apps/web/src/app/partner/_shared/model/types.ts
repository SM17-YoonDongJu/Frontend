import type { z } from "zod";
import type {
  reviewStatusSchema,
  reviewListItemSchema,
  paginationSchema,
  reviewListSchema,
  reviewStatusCountsSchema,
} from "./review-list.schema";

export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type ReviewListItem = z.infer<typeof reviewListItemSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type ReviewList = z.infer<typeof reviewListSchema>;
export type ReviewStatusCounts = z.infer<typeof reviewStatusCountsSchema>;

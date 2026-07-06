import type { z } from "zod";
import type {
  reviewStatusSchema,
  reviewedReportItemSchema,
  reviewSummarySchema,
  reviewFilterEchoSchema,
  paginationSchema,
  reviewedReportsSchema,
} from "./reviewed-reports.schema";

export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type ReviewedReportItem = z.infer<typeof reviewedReportItemSchema>;
export type ReviewSummary = z.infer<typeof reviewSummarySchema>;
export type ReviewFilterEcho = z.infer<typeof reviewFilterEchoSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type ReviewedReports = z.infer<typeof reviewedReportsSchema>;

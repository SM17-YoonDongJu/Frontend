import type { z } from "zod";
import type {
  reviewStatusSchema,
  reviewedReportItemSchema,
  reviewStatsSchema,
  reviewedReportsSchema,
} from "./reviewed-reports.schema";

export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type ReviewedReportItem = z.infer<typeof reviewedReportItemSchema>;
export type ReviewStats = z.infer<typeof reviewStatsSchema>;
export type ReviewedReports = z.infer<typeof reviewedReportsSchema>;

import type { z } from "zod";
import type {
  reviewStatusSchema,
  reviewedReportItemSchema,
  reviewedReportsSchema,
} from "./reviewed-reports.schema";

export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type ReviewedReportItem = z.infer<typeof reviewedReportItemSchema>;
export type ReviewedReports = z.infer<typeof reviewedReportsSchema>;

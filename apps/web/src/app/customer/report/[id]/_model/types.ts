import type { z } from "zod";
import type {
  reportStatusSchema,
  reportDetailSchema,
  issueItemSchema,
} from "./report-detail.schema";
import type {
  metricsUnavailableReasonSchema,
  reportAnalysisMetricsSchema,
} from "./report-analysis-metrics.schema";

export type ReportStatus = z.infer<typeof reportStatusSchema>;
export type ReportDetail = z.infer<typeof reportDetailSchema>;
export type IssueItem = z.infer<typeof issueItemSchema>;
export type ReportAnalysisMetrics = z.infer<typeof reportAnalysisMetricsSchema>;
export type MetricsUnavailableReason = z.infer<typeof metricsUnavailableReasonSchema>;

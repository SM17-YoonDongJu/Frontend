import type { z } from "zod";
import type {
  reportStatusSchema,
  reportDetailSchema,
  issueItemSchema,
} from "./report-detail.schema";

export type ReportStatus = z.infer<typeof reportStatusSchema>;
export type ReportDetail = z.infer<typeof reportDetailSchema>;
export type IssueItem = z.infer<typeof issueItemSchema>;

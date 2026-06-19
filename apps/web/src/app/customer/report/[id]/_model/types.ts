import type { z } from "zod";
import type {
  reportStatusSchema,
  reportDetailSchema,
  issueItemSchema,
  issueStatusSchema,
} from "./report-detail.schema";

export type ReportStatus = z.infer<typeof reportStatusSchema>;
export type ReportDetail = z.infer<typeof reportDetailSchema>;
export type IssueItem = z.infer<typeof issueItemSchema>;
export type IssueStatus = z.infer<typeof issueStatusSchema>;

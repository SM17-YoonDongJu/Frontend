import type { z } from "zod";
import type {
  issueReviewStatusSchema,
  reviewIssueSchema,
} from "./review-issue.schema";
import type {
  estimateRangeSchema,
  reviewAttachmentSchema,
  reviewClaimSchema,
  reviewClientSchema,
  reviewDetailSchema,
  reviewDirectionStatusSchema,
  reviewProgressSchema,
  reviewReportStatusSchema,
} from "./review-detail.schema";
import type {
  reviewSubmitIssueSchema,
  reviewSubmitResultSchema,
  reviewSubmitSchema,
} from "./review-submit.schema";

export type IssueReviewStatus = z.infer<typeof issueReviewStatusSchema>;
export type ReviewIssue = z.infer<typeof reviewIssueSchema>;
export type ReviewReportStatus = z.infer<typeof reviewReportStatusSchema>;
export type ReviewDirectionStatus = z.infer<typeof reviewDirectionStatusSchema>;
export type ReviewClient = z.infer<typeof reviewClientSchema>;
export type ReviewClaim = z.infer<typeof reviewClaimSchema>;
export type ReviewAttachment = z.infer<typeof reviewAttachmentSchema>;
export type EstimateRange = z.infer<typeof estimateRangeSchema>;
export type ReviewProgress = z.infer<typeof reviewProgressSchema>;
export type ReviewDetail = z.infer<typeof reviewDetailSchema>;
export type ReviewSubmitIssue = z.infer<typeof reviewSubmitIssueSchema>;
export type ReviewSubmit = z.infer<typeof reviewSubmitSchema>;
export type ReviewSubmitResult = z.infer<typeof reviewSubmitResultSchema>;

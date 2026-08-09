import type { z } from "zod";
import type {
  issueReviewStatusSchema,
  reviewIssueSchema,
} from "./review-issue.schema";
import type {
  reviewAttachmentSchema,
  reviewClientSchema,
  reviewDetailSchema,
  reviewReportStatusSchema,
} from "./review-detail.schema";
import type {
  reviewSubmitResultSchema,
  reviewSubmitSchema,
} from "./review-submit.schema";

export type IssueReviewStatus = z.infer<typeof issueReviewStatusSchema>;
export type ReviewIssue = z.infer<typeof reviewIssueSchema>;
export type ReviewReportStatus = z.infer<typeof reviewReportStatusSchema>;
export type ReviewClient = z.infer<typeof reviewClientSchema>;
export type ReviewAttachment = z.infer<typeof reviewAttachmentSchema>;
export type ReviewDetail = z.infer<typeof reviewDetailSchema>;
export type ReviewSubmit = z.infer<typeof reviewSubmitSchema>;
export type ReviewSubmitResult = z.infer<typeof reviewSubmitResultSchema>;

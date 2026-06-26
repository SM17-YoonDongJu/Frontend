import { z } from "zod";

export const reviewIssueStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "MODIFIED",
  "EXCLUDED",
]);

// 검수 쟁점(REPORT_ISSUES). 식별자·검토상태는 명세 issueId·reviewStatus 사용.
export const reviewIssueSchema = z.object({
  issueId: z.string(),
  title: z.string(),
  description: z.string(),
  impactAmount: z.number().int().nullable(),
  reviewStatus: reviewIssueStatusSchema,
  modifiedReason: z.string().nullable(),
  excludedReason: z.string().nullable(),
  adjusterOpinion: z.string().nullable(),
  tags: z.array(z.string()),
  isNew: z.boolean(),
});

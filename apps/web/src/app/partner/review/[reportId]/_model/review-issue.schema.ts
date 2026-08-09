import { z } from "zod";

/** 쟁점 검수 방향. null=미검수(작업 전). issue_id null=사정사 신규(ADDED). */
export const issueReviewStatusSchema = z.enum([
  "ACCEPTED",
  "MODIFIED",
  "EXCLUDED",
  "ADDED",
]);

/** 검수 화면 쟁점(REPORT_ISSUES + REPORT_REVIEW_ISSUES 오버레이). 출처: GET /reports/{id}/review issues[]. */
export const reviewIssueSchema = z.object({
  issueId: z.string().nullable(),
  reviewIssueId: z.string().nullable(),
  aiTitle: z.string().nullable(),
  aiDescription: z.string().nullable(),
  aiStatus: z.string().nullable(),
  tags: z.array(z.string()),
  impactAmount: z.number().int().nullable(),
  reviewStatus: issueReviewStatusSchema.nullable(),
  adjusterOpinion: z.string().nullable(),
  modifiedTitle: z.string().nullable(),
  modifiedDescription: z.string().nullable(),
  modifiedImpactAmount: z.number().int().nullable(),
  modifiedReason: z.string().nullable(),
  excludedReason: z.string().nullable(),
});

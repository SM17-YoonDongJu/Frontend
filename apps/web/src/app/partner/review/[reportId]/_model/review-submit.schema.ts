import { z } from "zod";
import { issueReviewStatusSchema } from "./review-issue.schema";
import type { IssueReview, ReviewReportRequest, ReviewReportResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

/**
 * 검수 반영 제출 쟁점(부분 upsert). 출처: PATCH /reports/{reportId} body issues[].
 * review_status 필수. issue_id는 ACCEPTED/MODIFIED/EXCLUDED면 필수, ADDED면 null.
 * title/description은 ADDED면 필수, modified_reason은 MODIFIED, excluded_reason은 EXCLUDED면 필수(서버 검증).
 */
export const reviewSubmitIssueSchema = z.object({
  reviewStatus: issueReviewStatusSchema,
  reviewIssueId: z.string().nullish(),
  issueId: z.string().nullable(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  impactAmount: z.number().int().nullish(),
  modifiedReason: z.string().nullish(),
  excludedReason: z.string().nullish(),
  adjusterOpinion: z.string().nullish(),
});

/** PATCH /reports/{reportId} body — 모든 최상위 필드 선택. status는 서버가 파생(전송 안 함). */
export const reviewSubmitSchema = z.object({
  estimateMinAmount: z.number().int().optional(),
  estimateMaxAmount: z.number().int().optional(),
  applicableGuarantees: z.array(z.string()).optional(),
  omittedSpecialContract: z.array(z.string()).optional(),
  basisTermsPrecedents: z.array(z.string()).optional(),
  review: z.string().optional(),
  issues: z.array(reviewSubmitIssueSchema).optional(),
});

export const reviewSubmitResultSchema = z.object({
  reportId: z.uuid(),
  status: z.string(),
  reportReviewId: z.string(),
  reviewStatus: z.string(),
});

type _ReviewSubmitIssueDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof reviewSubmitIssueSchema>, IssueReview>
>;
type _ReviewSubmitDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<z.infer<typeof reviewSubmitSchema>, "issues">, ReviewReportRequest>
>;
type _ReviewSubmitResultDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof reviewSubmitResultSchema>, ReviewReportResponse>
>;

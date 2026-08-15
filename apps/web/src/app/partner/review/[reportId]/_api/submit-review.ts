import "@/shared/api/client";
import { reviewReport } from "@/shared/api/generated/sdk.gen";
import { reviewSubmitResultSchema } from "../_model/review-submit.schema";
import type { ReviewSubmit, ReviewSubmitResult } from "../_model/types";

export async function submitReview(
  reportId: string,
  body: ReviewSubmit,
): Promise<ReviewSubmitResult> {
  const { data } = await reviewReport({
    throwOnError: true,
    path: { reportId },
    body: {
      ...body,
      issues: body.issues?.map((issue) => ({
        review_status: issue.reviewStatus,
        review_issue_id: issue.reviewIssueId ?? undefined,
        issue_id: issue.issueId ?? undefined,
        title: issue.title ?? undefined,
        description: issue.description ?? undefined,
        impact_amount: issue.impactAmount ?? undefined,
        modified_reason: issue.modifiedReason ?? undefined,
        excluded_reason: issue.excludedReason ?? undefined,
        adjuster_opinion: issue.adjusterOpinion ?? undefined,
      })),
    },
  });
  return reviewSubmitResultSchema.parse(data);
}

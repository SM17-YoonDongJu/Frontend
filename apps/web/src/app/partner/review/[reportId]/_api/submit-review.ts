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
        ...issue,
        reviewIssueId: issue.reviewIssueId ?? undefined,
        issueId: issue.issueId ?? undefined,
        title: issue.title ?? undefined,
        description: issue.description ?? undefined,
        impactAmount: issue.impactAmount ?? undefined,
        modifiedReason: issue.modifiedReason ?? undefined,
        excludedReason: issue.excludedReason ?? undefined,
        adjusterOpinion: issue.adjusterOpinion ?? undefined,
      })),
    },
  });
  return reviewSubmitResultSchema.parse(data);
}

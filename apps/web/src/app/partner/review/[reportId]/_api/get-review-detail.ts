import "@/shared/api/client";
import { reviewWorkspace } from "@/shared/api/generated/sdk.gen";
import { reviewDetailSchema } from "../_model/review-detail.schema";
import type { ReviewDetail } from "../_model/types";

export async function getReviewDetail(reportId: string): Promise<ReviewDetail> {
  const { data } = await reviewWorkspace({ throwOnError: true, path: { reportId } });
  return reviewDetailSchema.parse(data);
}

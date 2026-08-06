import "@/shared/api/client";
import { summary } from "@/shared/api/generated/sdk.gen";
import { reviewSummarySchema } from "../_model/review.schema";
import type { ReviewSummary } from "../_model/types";

export async function getReviewSummary(): Promise<ReviewSummary> {
  const { data } = await summary({ throwOnError: true });
  return reviewSummarySchema.parse(data);
}

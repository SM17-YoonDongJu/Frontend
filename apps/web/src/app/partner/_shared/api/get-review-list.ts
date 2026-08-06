import "@/shared/api/client";
import { pendingReview } from "@/shared/api/generated/sdk.gen";
import type { ReviewListFilter } from "@/shared/api/query-keys";
import { reviewListSchema } from "../model/review-list.schema";
import type { ReviewList } from "../model/types";

export async function getReviewList(filter?: ReviewListFilter): Promise<ReviewList> {
  const { data } = await pendingReview({
    throwOnError: true,
    query: {
      status: filter?.status,
      accidentType: filter?.accidentType,
      page: filter?.page,
      size: filter?.size,
    },
  });
  return reviewListSchema.parse(data);
}

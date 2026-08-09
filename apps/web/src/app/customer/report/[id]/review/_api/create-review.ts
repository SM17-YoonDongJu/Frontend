import "@/shared/api/client";
import { createReview as createReviewRequest } from "@/shared/api/generated/sdk.gen";
import {
  createReviewSchema,
  reviewResultSchema,
  type CreateReviewBody,
} from "../_model/review.schema";

export async function createReview(adjusterId: string, body: CreateReviewBody) {
  const { data } = await createReviewRequest({
    throwOnError: true,
    path: { adjusterId },
    body: createReviewSchema.parse(body),
  });
  return reviewResultSchema.parse(data);
}

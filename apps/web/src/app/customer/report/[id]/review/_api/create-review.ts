import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import {
  createReviewSchema,
  reviewResultSchema,
  type CreateReviewBody,
} from "../_model/review.schema";

export function createReview(adjusterId: string, body: CreateReviewBody) {
  return fetchJson(`${API_BASE_URL}/adjusters/${adjusterId}/reviews`, reviewResultSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createReviewSchema.parse(body)),
  });
}

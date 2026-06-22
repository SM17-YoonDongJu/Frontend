import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { reviewSubmitResultSchema } from "../_model/review-submit.schema";
import type { ReviewSubmit, ReviewSubmitResult } from "../_model/types";

export function submitReview(
  reportId: string,
  body: ReviewSubmit,
): Promise<ReviewSubmitResult> {
  return fetchJson(`${API_BASE_URL}/reports/${reportId}`, reviewSubmitResultSchema, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

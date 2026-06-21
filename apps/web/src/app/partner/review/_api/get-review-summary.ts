import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { reviewSummarySchema } from "../_model/review.schema";
import type { ReviewSummary } from "../_model/types";

export function getReviewSummary(): Promise<ReviewSummary> {
  return fetchJson(`${API_BASE_URL}/reports/pending-review/summary`, reviewSummarySchema);
}

import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { holdReviewSchema } from "../_model/review.schema";
import type { HoldReview } from "../_model/review.schema";

export function holdReview(reportId: string): Promise<HoldReview> {
  return fetchJson(`${API_BASE_URL}/reports/${reportId}/hold`, holdReviewSchema, {
    method: "PATCH",
  });
}

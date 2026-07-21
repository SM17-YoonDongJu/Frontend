import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { reviewDetailSchema } from "../_model/review-detail.schema";
import type { ReviewDetail } from "../_model/types";

export function getReviewDetail(reportId: string): Promise<ReviewDetail> {
  return fetchJson(`${API_BASE_URL}/reports/${reportId}/review`, reviewDetailSchema);
}

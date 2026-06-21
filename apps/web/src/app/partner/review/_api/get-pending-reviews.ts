import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { PendingReviewFilter } from "@/shared/api/query-keys";
import { pendingReviewPageSchema } from "../_model/pending-review.schema";
import type { PendingReviewPage } from "../_model/types";

export function getPendingReviews(
  filter?: PendingReviewFilter,
): Promise<PendingReviewPage> {
  const params = new URLSearchParams();
  if (filter?.status) params.set("status", filter.status);
  if (filter?.page != null) params.set("page", String(filter.page));
  if (filter?.size != null) params.set("size", String(filter.size));

  const query = params.toString();
  const url = `${API_BASE_URL}/reports/pending-review${query ? `?${query}` : ""}`;
  return fetchJson(url, pendingReviewPageSchema);
}

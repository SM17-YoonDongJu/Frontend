import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { ReviewListFilter } from "@/shared/api/query-keys";
import { reviewListSchema } from "../../_shared/model/review-list.schema";
import type { ReviewList } from "../../_shared/model/types";

export function getReviewList(filter?: ReviewListFilter): Promise<ReviewList> {
  const params = new URLSearchParams();
  if (filter?.status) params.set("status", filter.status);
  if (filter?.accidentType) params.set("accidentType", filter.accidentType);
  if (filter?.page != null) params.set("page", String(filter.page));
  if (filter?.size != null) params.set("size", String(filter.size));

  const query = params.toString();
  return fetchJson(
    `${API_BASE_URL}/reports/pending-review${query ? `?${query}` : ""}`,
    reviewListSchema,
  );
}

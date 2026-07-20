import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { ReviewedReportsFilter } from "@/shared/api/query-keys";
import { reviewedReportsSchema } from "../_model/reviewed-reports.schema";
import type { ReviewedReports } from "../_model/types";

/**
 * GET /adjusters/me/reviewed-reports?status=&month=&page=&size=
 * page는 0부터. status 미지정(전체=ALL)이면 파라미터 생략.
 */
export function getReviewedReports(
  filter: ReviewedReportsFilter | undefined,
  page: number,
): Promise<ReviewedReports> {
  const params = new URLSearchParams();
  if (filter?.status) params.set("status", filter.status);
  if (filter?.month) params.set("month", filter.month);
  params.set("page", String(page));
  if (filter?.size != null) params.set("size", String(filter.size));

  return fetchJson(
    `${API_BASE_URL}/adjusters/me/reviewed-reports?${params.toString()}`,
    reviewedReportsSchema,
  );
}

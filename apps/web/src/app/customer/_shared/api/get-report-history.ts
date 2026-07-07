import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { ReportHistoryFilter } from "@/shared/api/query-keys";
import { reportListSchema, type ReportListResponse } from "../model/report-list.schema";

/**
 * GET /reports?status=&page=
 * status 미지정(전체)이면 파라미터 생략. page는 무한쿼리 pageParam(1부터).
 */
export function getReportHistory(
  filter: ReportHistoryFilter | undefined,
  page: number,
): Promise<ReportListResponse> {
  const params = new URLSearchParams();
  if (filter?.status) params.set("status", filter.status);
  params.set("page", String(page));

  return fetchJson(`${API_BASE_URL}/reports?${params.toString()}`, reportListSchema);
}

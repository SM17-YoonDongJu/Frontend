import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { ReportHistoryFilter } from "@/shared/api/query-keys";
import { reportListSchema, type ReportListResponse } from "../model/report-list.schema";

/**
 * GET /me/received-proposals?page=
 * 고객이 요청건별로 받은 제안 목록(이슈 #78). page는 무한쿼리 pageParam(1부터).
 * 대시보드의 GET /reports와 분리된 전용 엔드포인트(🏷 API 스펙 협의 필요, MSW 선반영).
 */
export function getReportHistory(
  filter: ReportHistoryFilter | undefined,
  page: number,
): Promise<ReportListResponse> {
  const params = new URLSearchParams();
  if (filter?.status) params.set("status", filter.status);
  params.set("page", String(page));

  return fetchJson(`${API_BASE_URL}/me/received-proposals?${params.toString()}`, reportListSchema);
}

import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { reportListSchema, type ReportListResponse } from "../model/report-list.schema";

/**
 * GET /me/received-proposals?page=
 * 고객이 요청건별로 받은 제안 목록(이슈 #78). page는 무한쿼리 pageParam(1부터).
 * 대시보드의 GET /reports와 분리된 전용 엔드포인트(🏷 API 스펙 협의 필요, MSW 선반영).
 */
export function getReceivedProposals(page: number): Promise<ReportListResponse> {
  return fetchJson(`${API_BASE_URL}/me/received-proposals?page=${page}`, reportListSchema);
}

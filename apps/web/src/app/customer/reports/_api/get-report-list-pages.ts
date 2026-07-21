import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { ReportListInfiniteFilter } from "@/shared/api/query-keys";
import { reportListSchema } from "@/app/customer/_shared/model/report-list.schema";
import type { ReportListResponse } from "@/app/customer/_shared/model/report-list.schema";

/**
 * GET /reports?status=&page=&size=
 * 내 리포트 목록 무한 조회의 한 페이지 요청(page는 pageParam이 주입, 1-based).
 * status 미지정(전체)이면 파라미터 생략. 스키마는 _shared 정본 재사용.
 */
export function getReportListPages(
  filter: ReportListInfiniteFilter | undefined,
  page: number,
): Promise<ReportListResponse> {
  const params = new URLSearchParams();
  if (filter?.status) params.set("status", filter.status);
  params.set("page", String(page));
  if (filter?.size != null) params.set("size", String(filter.size));

  const query = params.toString();
  return fetchJson(
    `${API_BASE_URL}/reports${query ? `?${query}` : ""}`,
    reportListSchema,
  );
}

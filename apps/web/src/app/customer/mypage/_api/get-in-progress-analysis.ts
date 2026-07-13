import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { ReportListFilter } from "@/shared/api/query-keys";
import { reportListSchema } from "@/app/customer/_shared/model/report-list.schema";
import type { ReportListResponse } from "@/app/customer/_shared/model/report-list.schema";

// 진행 중 분석 — GET /reports 재사용(신규 스키마 없음, customer/_shared reportListSchema).
export function getInProgressAnalysis(
  filter?: ReportListFilter,
): Promise<ReportListResponse> {
  const query = new URLSearchParams();
  if (filter?.status) query.set("status", filter.status);
  if (filter?.page !== undefined) query.set("page", String(filter.page));

  const qs = query.toString();
  return fetchJson(
    `${API_BASE_URL}/reports${qs ? `?${qs}` : ""}`,
    reportListSchema,
  );
}

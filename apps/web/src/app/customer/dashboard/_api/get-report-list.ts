import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { ReportListFilter } from "@/shared/api/query-keys";
import { reportListSchema } from "../_model/report-list.schema";
import type { ReportList } from "../_model/types";

export function getReportList(filter?: ReportListFilter): Promise<ReportList> {
  const query = new URLSearchParams();
  if (filter?.status) query.set("status", filter.status);
  if (filter?.page !== undefined) query.set("page", String(filter.page));

  const qs = query.toString();
  return fetchJson(
    `${API_BASE_URL}/reports${qs ? `?${qs}` : ""}`,
    reportListSchema,
  );
}

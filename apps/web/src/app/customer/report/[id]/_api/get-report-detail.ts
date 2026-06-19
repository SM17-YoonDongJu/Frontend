import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { reportDetailSchema } from "../_model/report-detail.schema";
import type { ReportDetail } from "../_model/types";

export function getReportDetail(reportId: string): Promise<ReportDetail> {
  return fetchJson(`${API_BASE_URL}/reports/${reportId}`, reportDetailSchema);
}

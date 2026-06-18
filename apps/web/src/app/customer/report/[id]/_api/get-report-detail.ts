import { API_BASE_URL } from "@/shared/api/config";
import { reportDetailSchema } from "../_model/report-detail.schema";
import type { ReportDetail } from "../_model/types";

export async function getReportDetail(reportId: string): Promise<ReportDetail> {
  const res = await fetch(`${API_BASE_URL}/reports/${reportId}`);
  const json: unknown = await res.json();

  if (!res.ok || (json as { code?: string }).code) {
    const err = new Error((json as { message?: string }).message ?? "리포트를 불러오지 못했습니다.");
    err.name = (json as { code?: string }).code ?? "ERROR";
    throw err;
  }

  return reportDetailSchema.parse((json as { data: unknown }).data);
}

import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { createReportResponseSchema } from "../_model/report-request.schema";
import type { CreateReportBody, CreateReportResponse } from "../_model/types";

/** 분석 신청 생성. 성공 시 reportId·status 반환. */
export function createReport(body: CreateReportBody): Promise<CreateReportResponse> {
  return fetchJson(`${API_BASE_URL}/reports`, createReportResponseSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

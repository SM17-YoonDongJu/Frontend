import { API_BASE_URL } from "@/shared/api/config";
import { createReportResponseSchema } from "../_model/report-request.schema";
import type { CreateReportBody, CreateReportResponse } from "../_model/types";

/** 분석 신청 생성. 성공 시 reportId·status 반환. */
export async function createReport(body: CreateReportBody): Promise<CreateReportResponse> {
  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json: unknown = await res.json();

  if (!res.ok || (json as { code?: string }).code) {
    const err = new Error((json as { message?: string }).message ?? "분석 요청에 실패했습니다.");
    err.name = (json as { code?: string }).code ?? "ERROR";
    throw err;
  }

  return createReportResponseSchema.parse((json as { data: unknown }).data);
}

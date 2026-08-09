import "@/shared/api/client";
import { create as createReportRequest } from "@/shared/api/generated/sdk.gen";
import { createReportResponseSchema } from "../_model/report-request.schema";
import type { CreateReportBody, CreateReportResponse } from "../_model/types";

/** 분석 신청 생성. 성공 시 reportId·status 반환. */
export async function createReport(body: CreateReportBody): Promise<CreateReportResponse> {
  const { data } = await createReportRequest({
    throwOnError: true,
    body: {
      ...body,
      offeredAmount: body.offeredAmount ?? undefined,
      hospitalizations: body.hospitalizations?.map((h) => ({
        hospitalStart: h.hospitalStart,
        hospitalEnd: h.hospitalEnd ?? undefined,
        hospitalReason: h.hospitalReason ?? undefined,
      })) ?? undefined,
      description: body.description ?? undefined,
      additionalInformation: body.additionalInformation ?? undefined,
      documents: body.documents ?? undefined,
      question: body.question ?? undefined,
    },
  });
  return createReportResponseSchema.parse(data);
}

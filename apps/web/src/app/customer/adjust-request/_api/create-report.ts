import "@/shared/api/client";
import { create as createReportRequest } from "@/shared/api/generated/sdk.gen";
import { createReportResponseSchema } from "../_model/report-request.schema";
import type { CreateReportBody, CreateReportResponse } from "../_model/types";

/** 분석 신청 생성. 성공 시 reportId·status 반환. */
export async function createReport(body: CreateReportBody): Promise<CreateReportResponse> {
  const { data } = await createReportRequest({
    throwOnError: true,
    body: {
      product_id: body.productId,
      accident_type: body.accidentType,
      accident_date: body.accidentDate,
      diagnosis: body.diagnosis,
      offered_amount: body.offeredAmount ?? undefined,
      hospitalizations: body.hospitalizations?.map((h) => ({
        hospital_start: h.hospitalStart,
        hospital_end: h.hospitalEnd ?? undefined,
        hospital_reason: h.hospitalReason ?? undefined,
      })) ?? undefined,
      description: body.description ?? undefined,
      additional_information: body.additionalInformation ?? undefined,
      documents: body.documents ?? undefined,
      question: body.question ?? undefined,
    },
  });
  return createReportResponseSchema.parse(data);
}

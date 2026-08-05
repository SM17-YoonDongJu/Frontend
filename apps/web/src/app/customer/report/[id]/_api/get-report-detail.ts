import "@/shared/api/client";
import { detail } from "@/shared/api/generated/sdk.gen";
import { reportDetailSchema } from "../_model/report-detail.schema";
import type { ReportDetail } from "../_model/types";

export async function getReportDetail(reportId: string): Promise<ReportDetail> {
  const { data } = await detail({ throwOnError: true, path: { reportId } });
  return reportDetailSchema.parse(data);
}

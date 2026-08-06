import "@/shared/api/client";
import { list as listReports } from "@/shared/api/generated/sdk.gen";
import type { ReportListFilter } from "@/shared/api/query-keys";
import { reportListSchema } from "@/app/customer/_shared/model/report-list.schema";
import type { ReportListResponse } from "@/app/customer/_shared/model/report-list.schema";

// 진행 중 분석 — GET /reports 재사용(신규 스키마 없음, customer/_shared reportListSchema).
export async function getInProgressAnalysis(
  filter?: ReportListFilter,
): Promise<ReportListResponse> {
  const { data } = await listReports({
    throwOnError: true,
    query: {
      status: filter?.status,
      page: filter?.page,
    },
  });
  return reportListSchema.parse(data);
}

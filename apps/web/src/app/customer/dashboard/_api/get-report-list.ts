import "@/shared/api/client";
import { list as listReports } from "@/shared/api/generated/sdk.gen";
import type { ReportListFilter } from "@/shared/api/query-keys";
import { reportListSchema } from "@/app/customer/_shared/model/report-list.schema";
import type { ReportList } from "../_model/types";

export async function getReportList(filter?: ReportListFilter): Promise<ReportList> {
  const { data } = await listReports({
    throwOnError: true,
    query: {
      status: filter?.status,
      page: filter?.page,
    },
  });
  return reportListSchema.parse(data);
}

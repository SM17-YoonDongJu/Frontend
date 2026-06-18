"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import { GC_TIME_DETAIL, STALE_TIME_DETAIL } from "@/shared/api/query-constants";
import { getReportDetail } from "./get-report-detail";

export function useReportDetail(reportId: string) {
  return useSuspenseQuery({
    queryKey: reportKeys.detail(reportId).queryKey,
    queryFn: () => getReportDetail(reportId),
    staleTime: STALE_TIME_DETAIL,
    gcTime: GC_TIME_DETAIL,
  });
}

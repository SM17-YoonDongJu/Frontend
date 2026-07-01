"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import type { ReportListFilter } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getReportList } from "./get-report-list";

export function useReportList(filter?: ReportListFilter) {
  return useSuspenseQuery({
    queryKey: reportKeys.list(filter).queryKey,
    queryFn: () => getReportList(filter),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

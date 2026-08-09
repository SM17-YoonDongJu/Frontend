"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import type { ReportListFilter } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getInProgressAnalysis } from "./get-in-progress-analysis";

// 진행 중 분석 목록(폴링) — reportKeys.list 재사용, 스테퍼 파생은 _model/analysis-step.ts.
export function useInProgressAnalysis(filter?: ReportListFilter) {
  return useSuspenseQuery({
    queryKey: reportKeys.list(filter).queryKey,
    queryFn: () => getInProgressAnalysis(filter),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

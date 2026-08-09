"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import { GC_TIME_DETAIL, STALE_TIME_DETAIL } from "@/shared/api/query-constants";
import { getDraftPreview } from "./get-draft-preview";

export function useDraftPreview(reportId: string) {
  return useSuspenseQuery({
    queryKey: reportKeys.draftPreview(reportId).queryKey,
    queryFn: () => getDraftPreview(reportId),
    staleTime: STALE_TIME_DETAIL,
    gcTime: GC_TIME_DETAIL,
  });
}

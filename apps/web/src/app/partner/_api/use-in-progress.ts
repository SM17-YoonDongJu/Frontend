"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { adjusterKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getInProgressCases } from "./get-in-progress";

export function useInProgressCases() {
  return useSuspenseQuery({
    queryKey: adjusterKeys.inProgress().queryKey,
    queryFn: getInProgressCases,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

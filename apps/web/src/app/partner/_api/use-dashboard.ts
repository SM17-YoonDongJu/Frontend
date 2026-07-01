"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { adjusterKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getDashboard } from "./get-dashboard";

export function useDashboard() {
  return useSuspenseQuery({
    queryKey: adjusterKeys.dashboard().queryKey,
    queryFn: getDashboard,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

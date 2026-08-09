"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { adjusterKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getAdjusterHome } from "./get-home";

export function useAdjusterHome(inProgressLimit = 5) {
  return useSuspenseQuery({
    queryKey: adjusterKeys.home(inProgressLimit).queryKey,
    queryFn: () => getAdjusterHome(inProgressLimit),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

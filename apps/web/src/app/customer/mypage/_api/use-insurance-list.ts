"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_AUTH } from "@/shared/api/query-constants";
import { getInsuranceList } from "./get-insurance-list";

export function useInsuranceList() {
  return useSuspenseQuery({
    queryKey: userKeys.insurances.queryKey,
    queryFn: getInsuranceList,
    staleTime: STALE_TIME_AUTH,
    gcTime: GC_TIME_DEFAULT,
  });
}

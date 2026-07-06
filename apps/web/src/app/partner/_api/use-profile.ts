"use client";

import { useQuery } from "@tanstack/react-query";
import { adjusterKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_AUTH } from "@/shared/api/query-constants";
import { getProfile } from "./get-profile";

export function useProfile() {
  return useQuery({
    queryKey: adjusterKeys.meProfileSummary().queryKey,
    queryFn: getProfile,
    staleTime: STALE_TIME_AUTH,
    gcTime: GC_TIME_DEFAULT,
  });
}

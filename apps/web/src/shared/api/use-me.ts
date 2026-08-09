"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_AUTH } from "@/shared/api/query-constants";
import { getMe } from "./get-me";

export function useMe() {
  return useSuspenseQuery({
    queryKey: userKeys.me.queryKey,
    queryFn: getMe,
    staleTime: STALE_TIME_AUTH,
    gcTime: GC_TIME_DEFAULT,
  });
}

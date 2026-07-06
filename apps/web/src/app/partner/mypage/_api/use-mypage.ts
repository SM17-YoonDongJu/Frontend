"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { adjusterKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_AUTH } from "@/shared/api/query-constants";
import { getMypage } from "./get-mypage";

export function useMypage() {
  return useSuspenseQuery({
    queryKey: adjusterKeys.mypage().queryKey,
    queryFn: getMypage,
    staleTime: STALE_TIME_AUTH,
    gcTime: GC_TIME_DEFAULT,
  });
}

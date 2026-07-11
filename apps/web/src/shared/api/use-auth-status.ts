"use client";

import { useQuery } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_AUTH } from "@/shared/api/query-constants";
import type { Me } from "@/shared/model/user";
import { getMe } from "./get-me";

export type AuthStatus =
  | { status: "loading" }
  | { status: "authenticated"; me: Me }
  | { status: "unauthenticated" };

export function useAuthStatus(): AuthStatus {
  const { data, isPending, isError } = useQuery({
    queryKey: userKeys.me.queryKey,
    queryFn: getMe,
    retry: false,
    staleTime: STALE_TIME_AUTH,
    gcTime: GC_TIME_DEFAULT,
  });

  if (isError) return { status: "unauthenticated" };
  if (isPending) return { status: "loading" };
  return { status: "authenticated", me: data };
}

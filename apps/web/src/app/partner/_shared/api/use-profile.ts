"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { adjusterKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_AUTH } from "@/shared/api/query-constants";
import { getProfile } from "./get-profile";

const profileQueryOptions = {
  queryKey: adjusterKeys.meProfile().queryKey,
  queryFn: getProfile,
  staleTime: STALE_TIME_AUTH,
  gcTime: GC_TIME_DEFAULT,
};

/** 헤더·인사말처럼 프로필 없이도 화면이 그려지는 곳 — 로딩을 호출부가 다룬다. */
export function useProfile() {
  return useQuery(profileQueryOptions);
}

/** 편집 화면처럼 프로필이 있어야 렌더되는 곳 — 로딩은 상위 Suspense가 받는다. */
export function useProfileSuspense() {
  return useSuspenseQuery(profileQueryOptions);
}

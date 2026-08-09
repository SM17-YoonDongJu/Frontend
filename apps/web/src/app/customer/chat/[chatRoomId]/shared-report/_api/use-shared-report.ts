"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/query-keys";
import { GC_TIME_DETAIL, STALE_TIME_DETAIL } from "@/shared/api/query-constants";
import { getSharedReport } from "./get-shared-report";

// 등록된 검수 리포트는 수정 불가 → staleTime Infinity.
export function useSharedReport(chatRoomId: string) {
  return useSuspenseQuery({
    queryKey: chatKeys.sharedReport(chatRoomId).queryKey,
    queryFn: () => getSharedReport(chatRoomId),
    staleTime: STALE_TIME_DETAIL,
    gcTime: GC_TIME_DETAIL,
    // 404(검수 리포트 미등록)·403은 정상 분기라 재시도 없이 즉시 안내로 넘긴다.
    retry: false,
  });
}

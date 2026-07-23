"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getChatRoom } from "./get-chat-room";

// 방 상태(매칭·종료)가 상담 중 계속 바뀌는 실시간 화면 → 상세지만 staleTime 0.
export function useChatRoom(chatRoomId: string) {
  return useSuspenseQuery({
    queryKey: chatKeys.detail(chatRoomId).queryKey,
    queryFn: () => getChatRoom(chatRoomId),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

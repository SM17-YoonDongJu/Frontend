"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getChatList } from "./get-chat-list";
import type { ChatRoom } from "./chat.schema";

// 목록은 lastMessageAt desc 정렬(정렬은 훅 책임 — fetcher는 raw). 상담 실시간성 → staleTime 0.
export function useChatList() {
  return useSuspenseQuery({
    queryKey: chatKeys.list.queryKey,
    queryFn: getChatList,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
    select: (data): ChatRoom[] =>
      data.rooms.toSorted(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime(),
      ),
  });
}

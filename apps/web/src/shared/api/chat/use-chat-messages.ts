"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { chatKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import type { ChatMessage } from "./chat.schema";
import { getChatMessages } from "./get-chat-messages";

/**
 * 메시지 히스토리 — 커서 무한 조회.
 * 첫 페이지가 최신 구간, fetchNextPage가 더 오래된 구간을 이어 받는다(cursor=페이지 첫 메시지).
 * messages는 오래된 것부터 시간순으로 평탄화해 반환.
 */
export function useChatMessages(chatRoomId: string) {
  const query = useSuspenseInfiniteQuery({
    queryKey: chatKeys.messages(chatRoomId).queryKey,
    queryFn: ({ pageParam }) => getChatMessages(chatRoomId, pageParam ?? undefined),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });

  // pages[0]=최신 → 뒤 페이지일수록 과거. 화면은 과거→최신 순이므로 역순으로 이어붙인다.
  const messages = useMemo<ChatMessage[]>(
    () => query.data.pages.toReversed().flatMap((page) => page.list),
    [query.data.pages],
  );

  return {
    messages,
    hasOlder: query.hasNextPage,
    loadOlder: query.fetchNextPage,
    loadingOlder: query.isFetchingNextPage,
  };
}

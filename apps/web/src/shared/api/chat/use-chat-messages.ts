"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getChatMessages } from "./get-chat-messages";

export function useChatMessages(chatRoomId: string) {
  return useSuspenseQuery({
    queryKey: chatKeys.messages(chatRoomId).queryKey,
    queryFn: () => getChatMessages(chatRoomId),
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}

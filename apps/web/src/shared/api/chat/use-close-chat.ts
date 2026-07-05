"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/query-keys";
import { closeChat } from "./close-chat";

/** 상담 종료(ACTIVE→CLOSED). 성공 시 방 목록을 갱신해 입력 비활성이 반영된다. */
export function useCloseChat(chatRoomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => closeChat(chatRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.list.queryKey });
    },
  });
}

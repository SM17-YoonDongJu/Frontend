"use client";

import { useMutation } from "@tanstack/react-query";
import { readChat } from "./read-chat";

/**
 * 방 진입 시 읽음 처리(fire-and-forget). unread 배지 UI가 없어 목록 무효화는 생략(최소 배선).
 * unread_count 표시를 붙이면 onSuccess에서 chatKeys.list 무효화 추가.
 */
export function useReadChat(chatRoomId: string) {
  return useMutation({
    mutationFn: () => readChat(chatRoomId),
  });
}

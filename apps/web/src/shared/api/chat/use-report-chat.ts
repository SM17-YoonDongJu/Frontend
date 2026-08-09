"use client";

import { useMutation } from "@tanstack/react-query";
import { reportChat } from "./report-chat";
import type { ReportChatBody } from "./chat.schema";

/** 채팅 상대 신고. 방·목록 상태를 바꾸지 않아 무효화 대상이 없다. */
export function useReportChat(chatRoomId: string) {
  return useMutation({
    mutationFn: (body: ReportChatBody) => reportChat(chatRoomId, body),
  });
}

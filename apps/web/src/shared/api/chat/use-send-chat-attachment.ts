"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/query-keys";
import { sendChatMessage } from "./send-chat-message";
import { uploadChatAttachment } from "./upload-chat-attachment";

/**
 * 파일 첨부 전송 — 업로드 후 attachmentId로 메시지를 보낸다(⚠️ 명세없음-초안, MSW 선반영).
 * 업로드 지연이 있어 낙관적 append 없이 성공 시 재조회로 반영.
 */
export function useSendChatAttachment(chatRoomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const attachment = await uploadChatAttachment(chatRoomId, file);
      return sendChatMessage(chatRoomId, {
        content: "",
        attachmentIds: [attachment.attachmentId],
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(chatRoomId).queryKey,
      });
      queryClient.invalidateQueries({ queryKey: chatKeys.list.queryKey });
    },
  });
}

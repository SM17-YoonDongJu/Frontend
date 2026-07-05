"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/query-keys";
import { useMe } from "@/shared/api/use-me";
import { sendChatMessage } from "./send-chat-message";
import type {
  ChatList,
  ChatMessages,
  SendChatMessageBody,
} from "./chat.schema";

interface SendContext {
  previousMessages?: ChatMessages;
  previousList?: ChatList;
}

/**
 * 낙관적 메시지 전송. onMutate: cancel→snapshot→temp append + 목록 lastMessage 패치.
 * onError: 롤백(messages·list). onSettled: 두 쿼리 invalidate.
 */
export function useSendChatMessage(chatRoomId: string) {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  // mine 판별 기준(ChatThreadView currentUserId)과 동일 소스로 정합.
  // ⚠️ userId uuid 전환 백엔드 확인 요청 — 실서버 senderId 타입 확정 시 함께 정리.
  const optimisticSenderId = String(me.userId);
  const messagesKey = chatKeys.messages(chatRoomId).queryKey;
  const listKey = chatKeys.list.queryKey;

  return useMutation({
    mutationFn: (body: SendChatMessageBody) =>
      sendChatMessage(chatRoomId, body),

    onMutate: async (body): Promise<SendContext> => {
      await queryClient.cancelQueries({ queryKey: messagesKey });
      await queryClient.cancelQueries({ queryKey: listKey });

      const previousMessages =
        queryClient.getQueryData<ChatMessages>(messagesKey);
      const previousList = queryClient.getQueryData<ChatList>(listKey);

      const now = new Date().toISOString();

      queryClient.setQueryData<ChatMessages>(messagesKey, (current) => {
        const base: ChatMessages = current ?? { list: [], nextCursor: null };
        return {
          ...base,
          list: [
            ...base.list,
            {
              messageId: crypto.randomUUID(),
              senderId: optimisticSenderId,
              content: body.content,
              createdAt: now,
            },
          ],
        };
      });

      queryClient.setQueryData<ChatList>(listKey, (current) => {
        if (!current) return current;
        return {
          items: current.items.map((room) =>
            room.chatRoomId === chatRoomId
              ? { ...room, lastMessage: body.content, lastMessageAt: now }
              : room,
          ),
        };
      });

      return { previousMessages, previousList };
    },

    onError: (_error, _body, context) => {
      if (context?.previousMessages !== undefined) {
        queryClient.setQueryData(messagesKey, context.previousMessages);
      }
      if (context?.previousList !== undefined) {
        queryClient.setQueryData(listKey, context.previousList);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: messagesKey });
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}

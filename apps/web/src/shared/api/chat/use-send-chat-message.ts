"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/query-keys";
import { useMe } from "@/shared/api/use-me";
import { sendChatMessage } from "./send-chat-message";
import type {
  ChatList,
  ChatMessages,
  SendChatMessageBody,
} from "./chat.schema";

// use-chat-messages가 무한 조회라 메시지 캐시는 페이지 배열 형태
type ChatMessagesCache = InfiniteData<ChatMessages, string | null>;

interface SendContext {
  previousMessages?: ChatMessagesCache;
  previousList?: ChatList;
}

/**
 * 낙관적 메시지 전송. onMutate: cancel→snapshot→temp append + 목록 lastMessage 패치.
 * onError: 롤백(messages·list). onSettled: 두 쿼리 invalidate.
 */
export function useSendChatMessage(chatRoomId: string) {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  // 낙관적 임시 메시지의 senderId(표시용). mine 판별은 isMine 플래그가 담당.
  const optimisticSenderId = me.userId;
  const messagesKey = chatKeys.messages(chatRoomId).queryKey;
  const listKey = chatKeys.list.queryKey;

  return useMutation({
    mutationFn: (body: SendChatMessageBody) =>
      sendChatMessage(chatRoomId, body),

    onMutate: async (body): Promise<SendContext> => {
      await queryClient.cancelQueries({ queryKey: messagesKey });
      await queryClient.cancelQueries({ queryKey: listKey });

      const previousMessages =
        queryClient.getQueryData<ChatMessagesCache>(messagesKey);
      const previousList = queryClient.getQueryData<ChatList>(listKey);

      const now = new Date().toISOString();

      // 최신 구간인 첫 페이지(pages[0]) 끝에 temp 메시지 append
      queryClient.setQueryData<ChatMessagesCache>(messagesKey, (current) => {
        if (!current) return current;
        const [latest, ...older] = current.pages;
        const base: ChatMessages = latest ?? {
          messages: [],
          nextCursor: null,
          hasNext: false,
        };
        return {
          ...current,
          pages: [
            {
              ...base,
              messages: [
                ...base.messages,
                {
                  messageId: crypto.randomUUID(),
                  senderId: optimisticSenderId,
                  messageType: "TEXT",
                  content: body.content ?? "",
                  attachment: null,
                  isMine: true,
                  createdAt: now,
                },
              ],
            },
            ...older,
          ],
        };
      });

      queryClient.setQueryData<ChatList>(listKey, (current) => {
        if (!current) return current;
        return {
          rooms: current.rooms.map((room) =>
            room.chatRoomId === chatRoomId
              ? { ...room, lastMessage: body.content ?? room.lastMessage, lastMessageAt: now }
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

"use client";

import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getChatList } from "./get-chat-list";
import type { ChatRoom } from "./chat.schema";

/**
 * 제안 ↔ 채팅방 연결 조회. GET /chats의 reportReviewId(=proposalId)가 연결 키다.
 * 카드 단위로 쓰이므로 비-suspense useQuery(캐시는 useChatList와 chatKeys.list로 공유).
 * 방은 고객이 상담을 수락할 때 열린다(#325) — 아직 수락 전인 SENT 제안에는 방이 없어 chatRoom=null이다.
 * 수락 이후 화면(상담 진행·매칭 완료)에서만 쓰고, 전파 지연으로 비면 refetch로 재시도한다.
 */
export function useChatRoomByProposal(proposalId: string | null | undefined) {
  const query = useQuery({
    queryKey: chatKeys.list.queryKey,
    queryFn: getChatList,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
    enabled: Boolean(proposalId),
    select: (data): ChatRoom | null =>
      data.rooms.find((room) => room.proposalId === proposalId) ?? null,
  });

  const chatRoom = query.data ?? null;

  return {
    chatRoom,
    chatRoomId: chatRoom?.chatRoomId ?? null,
    isClosed: chatRoom?.roomStatus === "CLOSED",
    isPending: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
  };
}

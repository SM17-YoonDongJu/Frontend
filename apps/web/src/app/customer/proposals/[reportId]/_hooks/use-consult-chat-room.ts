"use client";

import { useRouter } from "next/navigation";
import { useChatRoomByProposal } from "@/shared/api/chat/use-chat-room-by-proposal";

const CHAT_ROOM_PENDING_NOTICE = "상담 채팅방을 확인하는 중이에요.";
const CHAT_ROOM_ERROR_NOTICE = "상담 채팅방 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
// 상담 수락으로 열린 방을 목록에서 찾는다(#325) — 전파 지연으로 안 잡히면 재시도(refetch)만 남긴다.
const CHAT_ROOM_MISSING_NOTICE = "상담 채팅방을 찾는 중이에요. 잠시 후 다시 시도해 주세요.";

export function useConsultChatRoom(proposalId: string) {
  const router = useRouter();
  const { chatRoomId, isPending, isError, refetch } = useChatRoomByProposal(proposalId);

  return {
    chatRoomId,
    isPending,
    isError,
    refetch,
    notice: isPending
      ? CHAT_ROOM_PENDING_NOTICE
      : isError
        ? CHAT_ROOM_ERROR_NOTICE
        : chatRoomId == null
          ? CHAT_ROOM_MISSING_NOTICE
          : null,
    openConsultChat: () => {
      if (chatRoomId == null) return;
      router.push(`/customer/chat/${chatRoomId}`);
    },
  };
}

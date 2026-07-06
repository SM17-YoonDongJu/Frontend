"use client";

import { useChatList } from "@/shared/api/chat/use-chat-list";
import type { ChatEmptyAction } from "./ChatRoomListPanel";
import { ChatRoomListPanel } from "./ChatRoomListPanel";

export interface ChatListContentProps {
  /** 방 링크 베이스(예 "/customer/chat") — 역할별 경로 */
  chatBasePath: string;
  activeChatRoomId?: string;
  /** 대화 없음 빈 상태 CTA — customer만 전달(손해사정사 찾기) */
  emptyAction?: ChatEmptyAction;
}

export function ChatListContent({
  chatBasePath,
  activeChatRoomId,
  emptyAction,
}: ChatListContentProps) {
  const { data: rooms } = useChatList();

  return (
    <ChatRoomListPanel
      rooms={rooms}
      buildHref={(chatRoomId) => `${chatBasePath}/${chatRoomId}`}
      activeChatRoomId={activeChatRoomId}
      emptyAction={emptyAction}
    />
  );
}

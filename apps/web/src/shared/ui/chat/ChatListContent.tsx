"use client";

import { useChatList } from "@/shared/api/chat/use-chat-list";
import { ChatRoomListPanel } from "./ChatRoomListPanel";

export interface ChatListContentProps {
  /** 방 링크 베이스(예 "/customer/chat") — 역할별 경로 */
  chatBasePath: string;
  activeChatRoomId?: string;
}

export function ChatListContent({ chatBasePath, activeChatRoomId }: ChatListContentProps) {
  const { data: rooms } = useChatList();

  return (
    <ChatRoomListPanel
      rooms={rooms}
      buildHref={(chatRoomId) => `${chatBasePath}/${chatRoomId}`}
      activeChatRoomId={activeChatRoomId}
    />
  );
}

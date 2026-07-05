"use client";

import { useRouter } from "next/navigation";
import { useChatList } from "@/shared/api/chat/use-chat-list";
import { useChatMessages } from "@/shared/api/chat/use-chat-messages";
import { useCloseChat } from "@/shared/api/chat/use-close-chat";
import { useSendChatMessage } from "@/shared/api/chat/use-send-chat-message";
import { useMe } from "@/shared/api/use-me";
import { ChatThreadHeader } from "./ChatThreadHeader";
import { ChatThreadView } from "./ChatThreadView";
import { MessageInputBar } from "./MessageInputBar";

export interface ChatThreadContentProps {
  chatRoomId: string;
  /** 방 목록·뒤로가기 베이스(예 "/customer/chat") */
  chatBasePath: string;
  /** 공유 리포트 베이스 — 역할별(customer "/customer/report" · partner "/partner/review") */
  reportBasePath: string;
}

export function ChatThreadContent({
  chatRoomId,
  chatBasePath,
  reportBasePath,
}: ChatThreadContentProps) {
  const router = useRouter();
  const { data: me } = useMe();
  const { data: rooms } = useChatList();
  const { data: messages } = useChatMessages(chatRoomId);
  const sendMessage = useSendChatMessage(chatRoomId);
  const closeChat = useCloseChat(chatRoomId);

  const room = rooms.find((item) => item.chatRoomId === chatRoomId);
  const closed = room?.roomStatus === "CLOSED";
  const currentUserId = String(me.userId);

  return (
    <div className="flex h-full flex-col">
      {room && (
        <ChatThreadHeader
          name={room.adjusterName}
          caseNo={room.caseNo}
          roomStatus={room.roomStatus}
          reportHref={`${reportBasePath}/${room.reportId}`}
          onBack={() => router.push(chatBasePath)}
          onClose={() => closeChat.mutate()}
          closePending={closeChat.isPending}
        />
      )}

      <ChatThreadView messages={messages.list} currentUserId={currentUserId} />

      <MessageInputBar
        onSend={(content) => sendMessage.mutate({ content })}
        disabled={sendMessage.isPending}
        closed={closed}
      />
    </div>
  );
}

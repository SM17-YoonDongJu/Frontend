"use client";

import { useRouter } from "next/navigation";
import { useChatList } from "@/shared/api/chat/use-chat-list";
import { useChatMessages } from "@/shared/api/chat/use-chat-messages";
import { useCloseChat } from "@/shared/api/chat/use-close-chat";
import { useSendChatAttachment } from "@/shared/api/chat/use-send-chat-attachment";
import { useSendChatMessage } from "@/shared/api/chat/use-send-chat-message";
import { useMe } from "@/shared/api/use-me";
import { toast } from "@/shared/ui/toast";
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
  const { messages, hasOlder, loadOlder, loadingOlder } = useChatMessages(chatRoomId);
  const sendMessage = useSendChatMessage(chatRoomId);
  const sendAttachment = useSendChatAttachment(chatRoomId);
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
          onClose={() =>
            closeChat.mutate(undefined, {
              onError: () =>
                toast.error("상담 종료에 실패했어요. 잠시 후 다시 시도해 주세요."),
            })
          }
          closePending={closeChat.isPending}
        />
      )}

      <ChatThreadView
        messages={messages}
        currentUserId={currentUserId}
        hasOlder={hasOlder}
        onLoadOlder={loadOlder}
        loadingOlder={loadingOlder}
      />

      <MessageInputBar
        onSend={(content) => sendMessage.mutate({ content })}
        disabled={sendMessage.isPending}
        closed={closed}
        sendFailed={sendMessage.isError}
        onPickFile={(file) =>
          sendAttachment.mutate(file, {
            onError: () =>
              toast.error("파일 전송에 실패했어요. 잠시 후 다시 시도해 주세요."),
          })
        }
        attachPending={sendAttachment.isPending}
      />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useChatMessages } from "@/shared/api/chat/use-chat-messages";
import { useChatRoom } from "@/shared/api/chat/use-chat-room";
import { useReadChat } from "@/shared/api/chat/use-read-chat";
import { useRejectChat } from "@/shared/api/chat/use-reject-chat";
import { useSendChatAttachment } from "@/shared/api/chat/use-send-chat-attachment";
import { useSendChatMessage } from "@/shared/api/chat/use-send-chat-message";
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
  const { data: room } = useChatRoom(chatRoomId);
  const { messages, hasOlder, loadOlder, loadingOlder } = useChatMessages(chatRoomId);
  const sendMessage = useSendChatMessage(chatRoomId);
  const sendAttachment = useSendChatAttachment(chatRoomId);
  // 상담 종료 UX는 명세상 reject(방 종료)로 매핑. 형제 방 유지·서버 미러.
  const endChat = useRejectChat(chatRoomId);
  const { mutate: markRead } = useReadChat(chatRoomId);

  useEffect(() => {
    markRead();
  }, [markRead, chatRoomId]);

  const closed = room.roomStatus === "CLOSED";

  return (
    <div className="flex h-full flex-col">
      <ChatThreadHeader
        name={room.counterpart.name}
        caseNo={room.caseNo}
        roomStatus={room.roomStatus}
        reportHref={room.reportId ? `${reportBasePath}/${room.reportId}` : "#"}
        onBack={() => router.push(chatBasePath)}
        onClose={() =>
          endChat.mutate(undefined, {
            onError: () =>
              toast.error("상담 종료에 실패했어요. 잠시 후 다시 시도해 주세요."),
          })
        }
        closePending={endChat.isPending}
      />

      <ChatThreadView
        messages={messages}
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

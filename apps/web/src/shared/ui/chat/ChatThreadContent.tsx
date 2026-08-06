"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useChatMessages } from "@/shared/api/chat/use-chat-messages";
import { useChatRoom } from "@/shared/api/chat/use-chat-room";
import { useReadChat } from "@/shared/api/chat/use-read-chat";
import { useRejectChat } from "@/shared/api/chat/use-reject-chat";
import { useSendChatAttachment } from "@/shared/api/chat/use-send-chat-attachment";
import { useSendChatMessage } from "@/shared/api/chat/use-send-chat-message";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { FileText } from "@/shared/ui/icons/FileText";
import { X } from "@/shared/ui/icons/X";
import { toast } from "@/shared/ui/toast";
import { ChatThreadHeader, type ChatThreadHeaderMenuAction } from "./ChatThreadHeader";
import { ChatThreadView } from "./ChatThreadView";
import { MessageInputBar } from "./MessageInputBar";
import { ReportChatDialog } from "./ReportChatDialog";
import { useReportChatDialog } from "./use-report-chat-dialog";

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
  reportBasePath
}: ChatThreadContentProps) {
  const router = useRouter();
  const { data: room } = useChatRoom(chatRoomId);
  const { messages, hasOlder, loadOlder, loadingOlder } = useChatMessages(chatRoomId);
  const sendMessage = useSendChatMessage(chatRoomId);
  const sendAttachment = useSendChatAttachment(chatRoomId);
  // 상담 종료 UX는 명세상 reject(방 종료)로 매핑. 형제 방 유지·서버 미러.
  const endChat = useRejectChat(chatRoomId);
  const { mutate: markRead } = useReadChat(chatRoomId);
  const reportDialog = useReportChatDialog(chatRoomId);

  useEffect(() => {
    markRead();
  }, [markRead, chatRoomId]);

  const closed = room.roomStatus === "CLOSED";

  const endChatConsultation = () =>
    endChat.mutate(undefined, {
      onError: () => toast.error("상담 종료에 실패했어요. 잠시 후 다시 시도해 주세요.")
    });

  const menuActions: ChatThreadHeaderMenuAction[] = [
    {
      key: "report",
      label: "리포트 보기",
      icon: <FileText />,
      href: room.reportId ? `${reportBasePath}/${room.reportId}` : "#"
    },
    ...(room.roomStatus === "ACTIVE"
      ? [
          {
            key: "close",
            label: "상담 종료",
            icon: <X />,
            onClick: endChatConsultation,
            tone: "danger" as const,
            disabled: endChat.isPending
          }
        ]
      : []),
    {
      key: "report-chat",
      label: "신고",
      icon: <AlertTriangle />,
      onClick: reportDialog.openDialog
    }
  ];

  return (
    <div className="flex h-full flex-col">
      <ChatThreadHeader
        name={room.counterpart.name}
        caseNo={room.caseNo}
        roomStatus={room.roomStatus}
        onBack={() => router.push(chatBasePath)}
        menuActions={menuActions}
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
            onError: () => toast.error("파일 전송에 실패했어요. 잠시 후 다시 시도해 주세요.")
          })
        }
        attachPending={sendAttachment.isPending}
      />

      <ReportChatDialog
        open={reportDialog.open}
        counterpartName={room.counterpart.name}
        pending={reportDialog.pending}
        errorMessage={reportDialog.errorMessage}
        onSubmit={reportDialog.submit}
        onClose={reportDialog.closeDialog}
      />
    </div>
  );
}

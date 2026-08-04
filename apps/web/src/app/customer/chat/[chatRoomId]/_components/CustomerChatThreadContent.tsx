"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatList } from "@/shared/api/chat/use-chat-list";
import { useChatMessages } from "@/shared/api/chat/use-chat-messages";
import { useChatRoom } from "@/shared/api/chat/use-chat-room";
import { toMatchGroup } from "@/shared/api/chat/match-status";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { useAcceptChat } from "@/shared/api/chat/use-accept-chat";
import { useReadChat } from "@/shared/api/chat/use-read-chat";
import { useRejectChat } from "@/shared/api/chat/use-reject-chat";
import { useSendChatAttachment } from "@/shared/api/chat/use-send-chat-attachment";
import { useSendChatMessage } from "@/shared/api/chat/use-send-chat-message";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { FileText } from "@/shared/ui/icons/FileText";
import { X } from "@/shared/ui/icons/X";
import { ChatComparisonBanner } from "@/shared/ui/chat/ChatComparisonBanner";
import {
  ChatThreadHeader,
  type ChatThreadHeaderMenuAction,
} from "@/shared/ui/chat/ChatThreadHeader";
import { ChatThreadView } from "@/shared/ui/chat/ChatThreadView";
import { MatchConfirmModal } from "@/shared/ui/chat/MatchConfirmModal";
import { MatchRejectConfirmModal } from "@/shared/ui/chat/MatchRejectConfirmModal";
import { MatchStatusBadge } from "@/shared/ui/chat/MatchStatusBadge";
import { MessageInputBar } from "@/shared/ui/chat/MessageInputBar";
import { ReportChatDialog } from "@/shared/ui/chat/ReportChatDialog";
import { useReportChatDialog } from "@/shared/ui/chat/use-report-chat-dialog";
import { ROOM_STATUS_META } from "@/shared/ui/chat/room-status";
import { toast } from "@/shared/ui/toast";

export interface CustomerChatThreadContentProps {
  chatRoomId: string;
  /** 방 목록·뒤로가기 베이스(예 "/customer/chat") */
  chatBasePath: string;
}

/**
 * customer 전용 채팅 스레드. 매칭 수락(accept)·거절(reject) 배선 전담.
 * partner용 ChatThreadContent(상담 종료)와 분리 — 매칭 상태가 partner 경로로 새지 않게 fork.
 */
export function CustomerChatThreadContent({
  chatRoomId,
  chatBasePath,
}: CustomerChatThreadContentProps) {
  const router = useRouter();
  const { data: room } = useChatRoom(chatRoomId);
  // 형제 방 비교(comparingCount·종료 예고)만 목록 유지 — 방 자체는 단건 조회
  const { data: rooms } = useChatList();
  const { messages, hasOlder, loadOlder, loadingOlder } = useChatMessages(chatRoomId);
  const sendMessage = useSendChatMessage(chatRoomId);
  const sendAttachment = useSendChatAttachment(chatRoomId);
  const accept = useAcceptChat(chatRoomId);
  const reject = useRejectChat(chatRoomId);
  const { mutate: markRead } = useReadChat(chatRoomId);
  const report = useReportChatDialog(chatRoomId);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  useEffect(() => {
    markRead();
  }, [markRead, chatRoomId]);

  const group = toMatchGroup(room.matchStatus, room.roomStatus);
  // 원본 리포트가 아니라 사정사 검수 결과(공유 리포트)로 이동. 사정사 검색 방은 공유 리포트가 없어 비활성.
  const sharedReportHref = room.reportId
    ? `${chatBasePath}/${chatRoomId}/shared-report`
    : "#";
  const matchPending = accept.isPending || reject.isPending;

  // 목록 응답에 현재 방이 아직 없어도(딥링크 직진입) 비교 수에 자신은 포함
  const listSiblings = room.reportId
    ? rooms.filter((item) => item.reportId === room.reportId)
    : [];
  const siblings = listSiblings.some(
    (item) => item.chatRoomId === room.chatRoomId,
  )
    ? listSiblings
    : [room, ...listSiblings];
  const comparingCount = siblings.filter(
    (item) => toMatchGroup(item.matchStatus, item.roomStatus) === "comparing",
  ).length;
  const endingConsultations = siblings
    .filter(
      (item) =>
        item.chatRoomId !== room.chatRoomId &&
        toMatchGroup(item.matchStatus, item.roomStatus) === "comparing",
    )
    .map((item) => ({ name: item.counterpart.name }));

  const subtitle = [
    room.caseNo,
    SUBTITLE_SUFFIX[group] ?? ROOM_STATUS_META[room.roomStatus].label,
  ]
    .filter(Boolean)
    .join(" · ");

  // 거절도 비가역이라 완료와 대칭으로 확인 모달을 거친다
  const rejectMatch = () => setRejectOpen(true);
  const confirmReject = () =>
    reject.mutate(undefined, {
      onSuccess: () => setRejectOpen(false),
      onError: () =>
        toast.error("매칭 거절에 실패했어요. 잠시 후 다시 시도해 주세요."),
    });
  const confirmMatch = () =>
    accept.mutate(undefined, {
      onSuccess: () => setConfirmOpen(false),
      onError: () =>
        toast.error("매칭 완료에 실패했어요. 잠시 후 다시 시도해 주세요."),
    });

  const matchActions: ChatThreadHeaderMenuAction[] =
    group === "comparing"
      ? [
          {
            key: "accept",
            label: "매칭 완료",
            icon: <CheckCircle />,
            onClick: () => setConfirmOpen(true),
            disabled: matchPending,
          },
          {
            key: "reject",
            label: "매칭 거절",
            icon: <X />,
            onClick: rejectMatch,
            tone: "danger",
            disabled: matchPending,
          },
        ]
      : group === "matched"
        ? [
            {
              key: "progress",
              label: "사건 진행 보기",
              icon: <ArrowRight />,
              href: sharedReportHref,
            },
          ]
        : [];

  const menuActions: ChatThreadHeaderMenuAction[] = [
    { key: "report", label: "리포트 보기", icon: <FileText />, href: sharedReportHref },
    ...matchActions,
    { key: "report-chat", label: "신고", icon: <AlertTriangle />, onClick: report.openDialog },
  ];

  return (
    <div className="flex h-full flex-col">
      <ChatThreadHeader
        name={room.counterpart.name}
        caseNo={room.caseNo}
        roomStatus={room.roomStatus}
        // customer 방의 상대는 항상 사정사 — counterpart.userId가 곧 adjusterId
        profileHref={`/customer/adjusters/${room.counterpart.userId}`}
        subtitle={subtitle}
        badge={group === "matched" ? <MatchStatusBadge group={group} /> : undefined}
        menuActions={menuActions}
        onBack={() => router.push(chatBasePath)}
      />

      {/* Figma 1012:9931 — 모바일 스레드엔 배너 없음(목록 배너·헤더 버튼이 대체). 데스크톱만 노출 */}
      {group === "comparing" && room.reportTypeLabel != null && (
        <div className="hidden md:block">
          <ChatComparisonBanner
            variant="comparing"
            reportTypeLabel={accidentTypeLabel(room.reportTypeLabel)}
            comparingCount={comparingCount}
          />
        </div>
      )}
      {group === "matched" && room.reportTypeLabel != null && (
        <div className="hidden md:block">
          <ChatComparisonBanner
            variant="matched"
            reportTypeLabel={accidentTypeLabel(room.reportTypeLabel)}
            progressHref={sharedReportHref}
          />
        </div>
      )}

      <ChatThreadView
        messages={messages}
        hasOlder={hasOlder}
        onLoadOlder={loadOlder}
        loadingOlder={loadingOlder}
      />

      <MessageInputBar
        onSend={(content) => sendMessage.mutate({ content })}
        disabled={sendMessage.isPending}
        closed={room.roomStatus === "CLOSED"}
        sendFailed={sendMessage.isError}
        onPickFile={(file) =>
          sendAttachment.mutate(file, {
            onError: () =>
              toast.error("파일 전송에 실패했어요. 잠시 후 다시 시도해 주세요."),
          })
        }
        attachPending={sendAttachment.isPending}
      />

      <MatchConfirmModal
        open={confirmOpen}
        adjusterName={room.counterpart.name}
        endingConsultations={endingConsultations}
        pending={matchPending}
        onConfirm={confirmMatch}
        onCancel={() => setConfirmOpen(false)}
      />

      <MatchRejectConfirmModal
        open={rejectOpen}
        adjusterName={room.counterpart.name}
        pending={matchPending}
        onConfirm={confirmReject}
        onCancel={() => setRejectOpen(false)}
      />

      <ReportChatDialog
        open={report.open}
        counterpartName={room.counterpart.name}
        pending={report.pending}
        errorMessage={report.errorMessage}
        onSubmit={report.submit}
        onClose={report.closeDialog}
      />
    </div>
  );
}

const SUBTITLE_SUFFIX: Partial<Record<ReturnType<typeof toMatchGroup>, string>> = {
  comparing: "상담 중 · 비교 중",
  matched: "매칭 완료 · 진행 중",
};

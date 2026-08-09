"use client";

import { accidentTypeLabel } from "@/shared/model/accident-type";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { FileText } from "@/shared/ui/icons/FileText";
import { X } from "@/shared/ui/icons/X";
import { ChatComparisonBanner } from "@/shared/ui/chat/ChatComparisonBanner";
import {
  ChatThreadHeader,
  type ChatThreadHeaderMenuAction
} from "@/shared/ui/chat/ChatThreadHeader";
import { ChatThreadView } from "@/shared/ui/chat/ChatThreadView";
import { MatchConfirmModal } from "@/shared/ui/chat/MatchConfirmModal";
import { MatchRejectConfirmModal } from "@/shared/ui/chat/MatchRejectConfirmModal";
import { MatchStatusBadge } from "@/shared/ui/chat/MatchStatusBadge";
import { MessageInputBar } from "@/shared/ui/chat/MessageInputBar";
import { ReportChatDialog } from "@/shared/ui/chat/ReportChatDialog";
import { useReportChatDialog } from "@/shared/ui/chat/use-report-chat-dialog";
import { useCustomerChatThread } from "../_hooks/use-customer-chat-thread";

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
  chatBasePath
}: CustomerChatThreadContentProps) {
  const { state, derived, actions } = useCustomerChatThread({ chatRoomId, chatBasePath });
  const { room } = state;
  const reportDialog = useReportChatDialog(chatRoomId);

  const matchActions: ChatThreadHeaderMenuAction[] =
    derived.group === "comparing"
      ? [
          {
            key: "accept",
            label: "매칭 완료",
            icon: <CheckCircle />,
            onClick: actions.openConfirm,
            disabled: derived.matchPending,
            // 데스크톱은 비교 배너에 전용 버튼이 있어 더보기에선 모바일에만 노출
            mobileOnly: true
          },
          {
            key: "reject",
            label: "매칭 거절",
            icon: <X />,
            onClick: actions.openReject,
            tone: "danger",
            disabled: derived.matchPending,
            // 데스크톱에선 접근 경로 없음(모바일 더보기 전용) — 팀 결정
            mobileOnly: true
          }
        ]
      : derived.group === "matched"
        ? [
            {
              key: "progress",
              label: "사건 진행 보기",
              icon: <ArrowRight />,
              href: derived.sharedReportHref
            }
          ]
        : [];

  const menuActions: ChatThreadHeaderMenuAction[] = [
    { key: "report", label: "리포트 보기", icon: <FileText />, href: derived.sharedReportHref },
    ...matchActions,
    { key: "report-chat", label: "신고", icon: <AlertTriangle />, onClick: reportDialog.openDialog }
  ];

  return (
    <div className="flex h-full flex-col">
      <ChatThreadHeader
        name={room.counterpart.name}
        caseNo={room.caseNo}
        roomStatus={room.roomStatus}
        // customer 방의 상대는 항상 사정사 — counterpart.userId가 곧 adjusterId
        profileHref={`/customer/adjusters/${room.counterpart.userId}`}
        subtitle={derived.subtitle}
        badge={derived.group === "matched" ? <MatchStatusBadge group={derived.group} /> : undefined}
        menuActions={menuActions}
        onBack={actions.goBack}
      />

      {/* Figma 1012:9931 — 모바일 스레드엔 배너 없음(목록 배너·헤더 버튼이 대체). 데스크톱만 노출 */}
      {derived.group === "comparing" && room.reportTypeLabel != null && (
        <div className="hidden md:block">
          <ChatComparisonBanner
            variant="comparing"
            reportTypeLabel={accidentTypeLabel(room.reportTypeLabel)}
            comparingCount={derived.comparingCount}
            onMatchComplete={actions.openConfirm}
            matchCompletePending={derived.matchPending}
          />
        </div>
      )}
      {derived.group === "matched" && room.reportTypeLabel != null && (
        <div className="hidden md:block">
          <ChatComparisonBanner
            variant="matched"
            reportTypeLabel={accidentTypeLabel(room.reportTypeLabel)}
            progressHref={derived.sharedReportHref}
          />
        </div>
      )}

      <ChatThreadView
        messages={state.messages}
        hasOlder={state.hasOlder}
        onLoadOlder={actions.loadOlder}
        loadingOlder={state.loadingOlder}
      />

      <MessageInputBar
        onSend={actions.send}
        disabled={derived.sendPending}
        closed={derived.closed}
        sendFailed={derived.sendFailed}
        onPickFile={actions.sendFile}
        attachPending={derived.attachPending}
      />

      <MatchConfirmModal
        open={state.confirmOpen}
        adjusterName={room.counterpart.name}
        endingConsultations={derived.endingConsultations}
        pending={derived.matchPending}
        onConfirm={actions.confirmMatch}
        onCancel={actions.closeConfirm}
      />

      <MatchRejectConfirmModal
        open={state.rejectOpen}
        adjusterName={room.counterpart.name}
        pending={derived.matchPending}
        onConfirm={actions.confirmReject}
        onCancel={actions.closeReject}
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

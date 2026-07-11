"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useChatList } from "@/shared/api/chat/use-chat-list";
import { useChatMessages } from "@/shared/api/chat/use-chat-messages";
import { isChatWritable, toMatchGroup } from "@/shared/api/chat/match-status";
import { useSendChatMessage } from "@/shared/api/chat/use-send-chat-message";
import { useMe } from "@/shared/api/use-me";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { X } from "@/shared/ui/icons/X";
import { ChatComparisonBanner } from "@/shared/ui/chat/ChatComparisonBanner";
import { ChatThreadHeader } from "@/shared/ui/chat/ChatThreadHeader";
import { ChatThreadView } from "@/shared/ui/chat/ChatThreadView";
import { MatchConfirmModal } from "@/shared/ui/chat/MatchConfirmModal";
import { MatchRejectConfirmModal } from "@/shared/ui/chat/MatchRejectConfirmModal";
import { MatchStatusBadge } from "@/shared/ui/chat/MatchStatusBadge";
import { MessageInputBar } from "@/shared/ui/chat/MessageInputBar";
import { ROOM_STATUS_META } from "@/shared/ui/chat/room-status";
import { useMatchProposal } from "../../../_shared/api/use-match-proposal";

export interface CustomerChatThreadContentProps {
  chatRoomId: string;
  /** 방 목록·뒤로가기 베이스(예 "/customer/chat") */
  chatBasePath: string;
  /** 공유 리포트 베이스(예 "/customer/report") */
  reportBasePath: string;
}

/**
 * customer 전용 채팅 스레드. 매칭(채택·거절) 배선 전담.
 * partner용 ChatThreadContent(상담 종료)와 분리 — 매칭 상태가 partner 경로로 새지 않게 fork.
 */
export function CustomerChatThreadContent({
  chatRoomId,
  chatBasePath,
  reportBasePath,
}: CustomerChatThreadContentProps) {
  const router = useRouter();
  const { data: me } = useMe();
  const { data: rooms } = useChatList();
  const { messages, hasOlder, loadOlder, loadingOlder } = useChatMessages(chatRoomId);
  const sendMessage = useSendChatMessage(chatRoomId);

  const room = rooms.find((item) => item.chatRoomId === chatRoomId);
  const match = useMatchProposal(room?.reportId ?? "");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const currentUserId = String(me.userId);

  if (!room) {
    return (
      <div className="flex h-full flex-col">
        <ChatThreadView
        messages={messages}
        currentUserId={currentUserId}
        hasOlder={hasOlder}
        onLoadOlder={loadOlder}
        loadingOlder={loadingOlder}
      />
      </div>
    );
  }

  const group = toMatchGroup(room.matchStatus, room.roomStatus);
  const reportHref = `${reportBasePath}/${room.reportId}`;

  const siblings = rooms.filter((item) => item.reportId === room.reportId);
  const comparingCount = siblings.filter(
    (item) => toMatchGroup(item.matchStatus, item.roomStatus) === "comparing",
  ).length;
  const endingConsultations = siblings
    .filter(
      (item) =>
        item.proposalId !== room.proposalId &&
        toMatchGroup(item.matchStatus, item.roomStatus) === "comparing",
    )
    .map((item) => ({ name: item.adjusterName }));

  const subtitle = `${room.caseNo} · ${SUBTITLE_SUFFIX[group] ?? ROOM_STATUS_META[room.roomStatus].label}`;

  // 거절도 비가역이라 완료와 대칭으로 확인 모달을 거친다
  const rejectMatch = () => setRejectOpen(true);
  const confirmReject = () =>
    match.mutate(
      { proposalId: room.proposalId, status: "REJECTED" },
      { onSuccess: () => setRejectOpen(false) },
    );
  const confirmMatch = () =>
    match.mutate(
      { proposalId: room.proposalId, status: "ACCEPTED" },
      { onSuccess: () => setConfirmOpen(false) },
    );

  const actions =
    group === "comparing" ? (
      // Figma 1012:11044/11042 — 매칭 완료(primary·ink)가 앞, 매칭 거절(terra)이 뒤
      <>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={match.isPending}
          className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          매칭 완료
          <CheckCircle className="text-[0.9375rem]" />
        </button>
        <button
          type="button"
          onClick={rejectMatch}
          disabled={match.isPending}
          className="flex items-center gap-1.5 rounded-full bg-terra px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          매칭 거절
          <X className="text-[0.875rem]" />
        </button>
      </>
    ) : group === "matched" ? (
      <Link
        href={reportHref}
        className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[0.8125rem] font-semibold text-white transition hover:brightness-[.96]"
      >
        사건 진행 보기
        <ArrowRight className="text-[0.9375rem]" />
      </Link>
    ) : null;

  // Figma 1012:9931 — 모바일 헤더 매칭 버튼(거절=terra-soft·완료=navy, 컴팩트). 데스크톱 actions보다 작고 순서·톤 상이
  const mobileActions =
    group === "comparing" ? (
      <>
        <button
          type="button"
          onClick={rejectMatch}
          disabled={match.isPending}
          className="rounded-button bg-terra-soft px-2.5 py-2 text-[0.75rem] font-bold text-terra transition hover:brightness-[.97] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          매칭 거절
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={match.isPending}
          className="flex items-center gap-1 rounded-button bg-navy px-2.5 py-2 text-[0.75rem] font-bold text-white transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          <CheckCircle className="text-[0.9375rem]" />
          매칭 완료
        </button>
      </>
    ) : group === "matched" ? (
      <Link
        href={reportHref}
        className="flex items-center gap-1 rounded-button bg-navy px-2.5 py-2 text-[0.75rem] font-bold text-white transition hover:brightness-[.96]"
      >
        사건 진행
        <ArrowRight className="text-[0.9375rem]" />
      </Link>
    ) : null;

  return (
    <div className="flex h-full flex-col">
      <ChatThreadHeader
        name={room.adjusterName}
        caseNo={room.caseNo}
        roomStatus={room.roomStatus}
        reportHref={reportHref}
        subtitle={subtitle}
        badge={group === "matched" ? <MatchStatusBadge group={group} /> : undefined}
        actions={actions}
        mobileActions={mobileActions}
        onBack={() => router.push(chatBasePath)}
      />

      {/* Figma 1012:9931 — 모바일 스레드엔 배너 없음(목록 배너·헤더 버튼이 대체). 데스크톱만 노출 */}
      {group === "comparing" && (
        <div className="hidden md:block">
          <ChatComparisonBanner
            variant="comparing"
            reportTypeLabel={room.reportTypeLabel}
            comparingCount={comparingCount}
          />
        </div>
      )}
      {group === "matched" && (
        <div className="hidden md:block">
          <ChatComparisonBanner
            variant="matched"
            reportTypeLabel={room.reportTypeLabel}
            progressHref={reportHref}
          />
        </div>
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
        closed={!isChatWritable(group)}
        sendFailed={sendMessage.isError}
      />

      <MatchConfirmModal
        open={confirmOpen}
        adjusterName={room.adjusterName}
        endingConsultations={endingConsultations}
        pending={match.isPending}
        onConfirm={confirmMatch}
        onCancel={() => setConfirmOpen(false)}
      />

      <MatchRejectConfirmModal
        open={rejectOpen}
        adjusterName={room.adjusterName}
        pending={match.isPending}
        onConfirm={confirmReject}
        onCancel={() => setRejectOpen(false)}
      />
    </div>
  );
}

const SUBTITLE_SUFFIX: Partial<Record<ReturnType<typeof toMatchGroup>, string>> = {
  comparing: "상담 중 · 비교 중",
  matched: "매칭 완료 · 진행 중",
};

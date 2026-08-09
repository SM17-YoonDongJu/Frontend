"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toMatchGroup } from "@/shared/api/chat/match-status";
import { useAcceptChat } from "@/shared/api/chat/use-accept-chat";
import { useChatList } from "@/shared/api/chat/use-chat-list";
import { useChatMessages } from "@/shared/api/chat/use-chat-messages";
import { useChatRoom } from "@/shared/api/chat/use-chat-room";
import { useReadChat } from "@/shared/api/chat/use-read-chat";
import { useRejectChat } from "@/shared/api/chat/use-reject-chat";
import { useSendChatAttachment } from "@/shared/api/chat/use-send-chat-attachment";
import { useSendChatMessage } from "@/shared/api/chat/use-send-chat-message";
import { ROOM_STATUS_META } from "@/shared/ui/chat/room-status";
import { toast } from "@/shared/ui/toast";

const SUBTITLE_SUFFIX: Partial<Record<ReturnType<typeof toMatchGroup>, string>> = {
  comparing: "상담 중 · 비교 중",
  matched: "매칭 완료 · 진행 중",
};

interface UseCustomerChatThreadParams {
  chatRoomId: string;
  /** 방 목록·뒤로가기 베이스(예 "/customer/chat") */
  chatBasePath: string;
}

export function useCustomerChatThread({ chatRoomId, chatBasePath }: UseCustomerChatThreadParams) {
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  useEffect(() => {
    markRead();
  }, [markRead, chatRoomId]);

  const derived = useMemo(() => {
    const group = toMatchGroup(room.matchStatus, room.roomStatus);

    // 목록 응답에 현재 방이 아직 없어도(딥링크 직진입) 비교 수에 자신은 포함
    const listSiblings = room.reportId ? rooms.filter((item) => item.reportId === room.reportId) : [];
    const siblings = listSiblings.some((item) => item.chatRoomId === room.chatRoomId)
      ? listSiblings
      : [room, ...listSiblings];

    return {
      group,
      // 원본 리포트가 아니라 사정사 검수 결과(공유 리포트)로 이동. 사정사 검색 방은 공유 리포트가 없어 비활성.
      sharedReportHref: room.reportId ? `${chatBasePath}/${chatRoomId}/shared-report` : "#",
      subtitle: [room.caseNo, SUBTITLE_SUFFIX[group] ?? ROOM_STATUS_META[room.roomStatus].label]
        .filter(Boolean)
        .join(" · "),
      comparingCount: siblings.filter(
        (item) => toMatchGroup(item.matchStatus, item.roomStatus) === "comparing",
      ).length,
      endingConsultations: siblings
        .filter(
          (item) =>
            item.chatRoomId !== room.chatRoomId &&
            toMatchGroup(item.matchStatus, item.roomStatus) === "comparing",
        )
        .map((item) => ({ name: item.counterpart.name })),
      matchPending: accept.isPending || reject.isPending,
      sendPending: sendMessage.isPending,
      sendFailed: sendMessage.isError,
      attachPending: sendAttachment.isPending,
      closed: room.roomStatus === "CLOSED",
    };
  }, [
    room,
    rooms,
    chatRoomId,
    chatBasePath,
    accept.isPending,
    reject.isPending,
    sendMessage.isPending,
    sendMessage.isError,
    sendAttachment.isPending,
  ]);

  const { mutate: acceptMatch } = accept;
  const { mutate: rejectMatch } = reject;
  const { mutate: send } = sendMessage;
  const { mutate: sendFile } = sendAttachment;

  const confirmMatch = useCallback(
    () =>
      acceptMatch(undefined, {
        onSuccess: () => setConfirmOpen(false),
        onError: () => toast.error("매칭 완료에 실패했어요. 잠시 후 다시 시도해 주세요."),
      }),
    [acceptMatch],
  );

  // 거절도 비가역이라 완료와 대칭으로 확인 모달을 거친다
  const confirmReject = useCallback(
    () =>
      rejectMatch(undefined, {
        onSuccess: () => setRejectOpen(false),
        onError: () => toast.error("매칭 거절에 실패했어요. 잠시 후 다시 시도해 주세요."),
      }),
    [rejectMatch],
  );

  const actions = useMemo(
    () => ({
      openConfirm: () => setConfirmOpen(true),
      closeConfirm: () => setConfirmOpen(false),
      openReject: () => setRejectOpen(true),
      closeReject: () => setRejectOpen(false),
      confirmMatch,
      confirmReject,
      send: (content: string) => send({ content }),
      sendFile: (file: File) =>
        sendFile(file, {
          onError: () => toast.error("파일 전송에 실패했어요. 잠시 후 다시 시도해 주세요."),
        }),
      loadOlder,
      goBack: () => router.push(chatBasePath),
    }),
    [confirmMatch, confirmReject, send, sendFile, loadOlder, router, chatBasePath],
  );

  return {
    state: { room, messages, hasOlder, loadingOlder, confirmOpen, rejectOpen },
    derived,
    actions,
  };
}

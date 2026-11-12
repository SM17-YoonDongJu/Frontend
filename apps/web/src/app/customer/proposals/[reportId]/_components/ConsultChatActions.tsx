"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { MatchConfirmModal } from "@/shared/ui/chat/MatchConfirmModal";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { MessageCircle } from "@/shared/ui/icons/MessageCircle";
import { toast } from "@/shared/ui/toast";
import { useAcceptChat } from "@/shared/api/chat/use-accept-chat";
import { useConsultChatRoom } from "../_hooks/use-consult-chat-room";
import { ACTION_BUTTON_CLASS } from "./consult-action-style";

interface ConsultChatActionsProps {
  proposalId: string;
  /** 매칭 확인 모달 제목에 쓰는 사정사 표시명. */
  adjusterName: string;
  /** 매칭 시 함께 종료되는 같은 리포트의 다른 제안 사정사 이름. */
  otherProposalNames: string[];
  onOpenDetail: () => void;
}

/**
 * 상담 진행 중(COUNSELING) 카드 액션 — 채팅방 이동 + 매칭 완료.
 *
 * 매칭 완료는 채팅방 헤더와 같은 PATCH /chats/{chatRoomId}/accept를 쓴다(#325).
 * 제안 PATCH에 다시 ACCEPTED를 보내는 방식은 상담 수락 전용이라 이미 COUNSELING인
 * 제안에는 아무 변화도 일으키지 않는다.
 */
export function ConsultChatActions({
  proposalId,
  adjusterName,
  otherProposalNames,
  onOpenDetail,
}: ConsultChatActionsProps) {
  const { chatRoomId, isPending, notice, openConsultChat } = useConsultChatRoom(proposalId);
  const acceptChat = useAcceptChat(chatRoomId ?? "");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 매칭 완료 시 같은 리포트의 다른 제안이 자동 종료·되돌릴 수 없어 확인 모달을 거친다(채팅 화면과 동일 정책)
  const confirmMatch = () => {
    if (chatRoomId == null) {
      toast.error("상담 채팅방을 찾지 못해 매칭을 완료할 수 없어요.");
      return;
    }
    acceptChat.mutate(undefined, {
      onSuccess: () => setConfirmOpen(false),
      onError: () => toast.error("매칭 완료 처리에 실패했어요. 잠시 후 다시 시도해 주세요."),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-2">
        <Button variant="outline" size="sm" className={ACTION_BUTTON_CLASS} onClick={onOpenDetail}>
          상세 보기
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={ACTION_BUTTON_CLASS}
          loading={isPending}
          disabled={chatRoomId == null}
          iconLeft={<MessageCircle className="text-[0.9375rem]" />}
          onClick={openConsultChat}
        >
          상담채팅 진행
        </Button>
      </div>
      {notice && <p className="text-[0.71875rem] leading-normal text-ink-3">{notice}</p>}
      <Button
        size="sm"
        full
        loading={acceptChat.isPending}
        disabled={chatRoomId == null}
        icon={<ArrowRight className="text-[0.9375rem]" />}
        className={ACTION_BUTTON_CLASS}
        onClick={() => setConfirmOpen(true)}
      >
        매칭 완료
      </Button>

      <MatchConfirmModal
        open={confirmOpen}
        adjusterName={adjusterName}
        endingConsultations={otherProposalNames.map((name) => ({ name }))}
        pending={acceptChat.isPending}
        onConfirm={confirmMatch}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

"use client";

import { Button } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { MessageCircle } from "@/shared/ui/icons/MessageCircle";
import { useConsultChatRoom } from "../_hooks/use-consult-chat-room";
import { ACTION_BUTTON_CLASS } from "./consult-action-style";

interface ConsultChatActionsProps {
  proposalId: string;
  onMatchComplete: () => void;
  matchPending: boolean;
  onOpenDetail: () => void;
}

/** 상담 진행 중(COUNSELING) 카드 액션 — 채팅방 이동 + 매칭 완료. */
export function ConsultChatActions({
  proposalId,
  onMatchComplete,
  matchPending,
  onOpenDetail,
}: ConsultChatActionsProps) {
  const { chatRoomId, isPending, notice, openConsultChat } = useConsultChatRoom(proposalId);

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
        loading={matchPending}
        icon={<ArrowRight className="text-[0.9375rem]" />}
        className={ACTION_BUTTON_CLASS}
        onClick={onMatchComplete}
      >
        매칭 완료
      </Button>
    </div>
  );
}

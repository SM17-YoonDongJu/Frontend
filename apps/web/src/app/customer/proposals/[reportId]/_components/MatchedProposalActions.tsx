"use client";

import { Button } from "@/shared/ui/Button";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { MessageCircle } from "@/shared/ui/icons/MessageCircle";
import { useConsultChatRoom } from "../_hooks/use-consult-chat-room";
import { ACTION_BUTTON_CLASS } from "./consult-action-style";

/** 매칭 완료(ACCEPTED) 카드 액션 — 상태 뱃지 + 읽기 전용 채팅 이동. */
export function MatchedProposalActions({ proposalId }: { proposalId: string }) {
  const { chatRoomId, isPending, openConsultChat } = useConsultChatRoom(proposalId);

  return (
    <div className="flex items-center justify-between gap-2.5">
      <StatusBadge tone="green" icon={<CheckCircle className="text-[0.875rem]" />}>
        매칭 완료
      </StatusBadge>
      {(isPending || chatRoomId != null) && (
        <Button
          variant="outline"
          size="sm"
          className={ACTION_BUTTON_CLASS}
          loading={isPending}
          disabled={chatRoomId == null}
          iconLeft={<MessageCircle className="text-[0.9375rem]" />}
          onClick={openConsultChat}
        >
          채팅 보기
        </Button>
      )}
    </div>
  );
}

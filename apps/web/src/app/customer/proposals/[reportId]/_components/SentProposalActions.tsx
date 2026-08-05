"use client";

import { Button } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { toast } from "@/shared/ui/toast";
import { useConsultChatRoom } from "../_hooks/use-consult-chat-room";
import { ACTION_BUTTON_CLASS } from "./consult-action-style";

/**
 * 제안 도착(SENT) 카드 액션 — 상담 수락 시 선생성된 채팅방으로 즉시 이동(#231).
 * 방 미조회·조회 실패 시 토스트로 안내하고 카드는 유지(클릭 재시도 시 refetch).
 */
export function SentProposalActions({
  proposalId,
  onOpenDetail,
}: {
  proposalId: string;
  onOpenDetail: () => void;
}) {
  const { chatRoomId, isPending, refetch, openConsultChat } = useConsultChatRoom(proposalId);

  const acceptConsult = () => {
    if (chatRoomId == null) {
      toast.error("상담 채팅방으로 이동하지 못했어요. 잠시 후 다시 시도해 주세요.");
      refetch();
      return;
    }
    openConsultChat();
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-2">
      <Button variant="outline" size="sm" className={ACTION_BUTTON_CLASS} onClick={onOpenDetail}>
        상세 보기
      </Button>
      <Button
        size="sm"
        loading={isPending}
        icon={<ArrowRight className="text-[0.9375rem]" />}
        className={ACTION_BUTTON_CLASS}
        onClick={acceptConsult}
      >
        상담 수락
      </Button>
    </div>
  );
}

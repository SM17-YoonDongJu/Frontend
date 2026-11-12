"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { toast } from "@/shared/ui/toast";
import { useMatchProposal } from "../../../_shared/api/use-match-proposal";
import { ACTION_BUTTON_CLASS } from "./consult-action-style";

/**
 * 제안 도착(SENT) 카드 액션 — 상담 수락으로 채팅방을 열고 그 방으로 이동한다(#325).
 *
 * 방은 제안 발송 시점에 만들어지지 않는다. 수락 요청을 받아야 백엔드가 방을 열고,
 * 이미 열린 방이 있으면 같은 id를 돌려주므로 여러 번 눌러도 방이 중복으로 생기지 않는다.
 * 실패하면 토스트만 띄우고 카드는 그대로 둬 다시 누를 수 있게 한다.
 */
export function SentProposalActions({
  reportId,
  proposalId,
  onOpenDetail,
}: {
  reportId: string;
  proposalId: string;
  onOpenDetail: () => void;
}) {
  const router = useRouter();
  const matchProposal = useMatchProposal(reportId);

  const acceptConsult = () => {
    matchProposal.mutate(
      { proposalId, status: "ACCEPTED" },
      {
        onSuccess: (result) => {
          if (result.chatRoomId == null) {
            toast.error("상담 채팅방으로 이동하지 못했어요. 잠시 후 다시 시도해 주세요.");
            return;
          }
          router.push(`/customer/chat/${result.chatRoomId}`);
        },
        onError: () =>
          toast.error("상담 수락에 실패했어요. 잠시 후 다시 시도해 주세요."),
      },
    );
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-2">
      <Button variant="outline" size="sm" className={ACTION_BUTTON_CLASS} onClick={onOpenDetail}>
        상세 보기
      </Button>
      <Button
        size="sm"
        loading={matchProposal.isPending}
        icon={<ArrowRight className="text-[0.9375rem]" />}
        className={ACTION_BUTTON_CLASS}
        onClick={acceptConsult}
      >
        상담 수락
      </Button>
    </div>
  );
}

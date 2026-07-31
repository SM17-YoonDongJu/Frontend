"use client";

import { useRouter } from "next/navigation";
import { useChatRoomByProposal } from "@/shared/api/chat/use-chat-room-by-proposal";
import { Button } from "@/shared/ui/Button";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { MessageCircle } from "@/shared/ui/icons/MessageCircle";

const ACTION_BUTTON_CLASS = "h-[2.125rem] px-[0.9375rem] py-[0.5625rem] text-[0.8125rem]";
const CHAT_ROOM_PENDING_NOTICE = "상담 채팅방을 확인하는 중이에요.";
const CHAT_ROOM_ERROR_NOTICE = "상담 채팅방 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
// 채팅방 생성·활성화 API가 명세 미확정 → 조회된 방이 없으면 이동 대신 안내만 한다.
const CHAT_ROOM_MISSING_NOTICE = "상담 채팅방을 준비 중이에요. 개설되면 여기서 바로 입장할 수 있어요.";

function useConsultChatRoom(proposalId: string) {
  const router = useRouter();
  const { chatRoomId, isPending, isError } = useChatRoomByProposal(proposalId);

  return {
    chatRoomId,
    isPending,
    isError,
    notice: isPending
      ? CHAT_ROOM_PENDING_NOTICE
      : isError
        ? CHAT_ROOM_ERROR_NOTICE
        : chatRoomId == null
          ? CHAT_ROOM_MISSING_NOTICE
          : null,
    openConsultChat: () => {
      if (chatRoomId == null) return;
      router.push(`/customer/chat/${chatRoomId}`);
    },
  };
}

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

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { MatchConfirmModal } from "@/shared/ui/chat/MatchConfirmModal";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { Star } from "@/shared/ui/icons/Star";
import { toast } from "@/shared/ui/toast";
import { useMatchProposal } from "../../../_shared/api/use-match-proposal";
import { getProposalAction } from "../../../_shared/model/proposal-actions";
import { useViewedProposals } from "../_hooks/use-viewed-proposals";
import { ConsultChatActions } from "./ConsultChatActions";
import { MatchedProposalActions } from "./MatchedProposalActions";
import { SentProposalActions } from "./SentProposalActions";
import type { Proposal } from "../../../_shared/model/proposal.schema";
import { formatManwon } from "@/shared/lib/format-amount";

interface ProposalCardProps {
  reportId: string;
  proposal: Proposal;
  /** 수락 시 함께 종료되는 같은 리포트의 다른 제안 사정사 이름. */
  otherProposalNames: string[];
}

function formatEstimateRange(min?: number | null, max?: number | null) {
  if (min == null || max == null) return null;
  return `${formatManwon(min)} – ${formatManwon(max)}만`;
}

function formatCredential(career?: number | null, speciality?: string | null) {
  return [career != null ? `경력 ${career}년` : null, speciality].filter(Boolean).join(" · ");
}

export function ProposalCard({ reportId, proposal, otherProposalNames }: ProposalCardProps) {
  const router = useRouter();
  const { isViewed, markViewed } = useViewedProposals();
  const matchProposal = useMatchProposal(reportId);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    proposalId,
    adjusterId,
    nickname,
    rating,
    proposalSummary,
    speciality,
    career,
    isNew,
    isVerified,
    estimateMinAmount,
    estimateMaxAmount,
    feeBasis,
    status,
  } = proposal;
  const cardAction = getProposalAction(status);
  const viewed = isViewed(adjusterId);
  const estimateRange = formatEstimateRange(estimateMinAmount, estimateMaxAmount);
  const credential = formatCredential(career, speciality);

  const openReviewReport = () => {
    markViewed(adjusterId);
    router.push(`/customer/report/${reportId}`);
  };

  // 매칭 완료 시 같은 리포트의 다른 제안이 자동 종료·되돌릴 수 없어 확인 모달을 거친다(채팅 화면과 동일 정책)
  const openMatchConfirm = () => {
    setConfirmOpen(true);
  };

  const confirmMatch = () => {
    matchProposal.mutate(
      { proposalId, status: "ACCEPTED" },
      {
        onSuccess: () => setConfirmOpen(false),
        onError: () =>
          toast.error("매칭 완료 처리에 실패했어요. 잠시 후 다시 시도해 주세요."),
      },
    );
  };

  return (
    <article
      className={cn(
        "flex flex-col gap-[0.8125rem] rounded-card border border-line bg-card p-[1.1875rem] shadow-[0_1px_1px_rgba(21,32,46,0.03)] transition",
        viewed && "opacity-60",
      )}
    >
      <Link
        href={`/customer/adjusters/${adjusterId}`}
        className="flex items-start gap-[0.8125rem] rounded-input transition hover:opacity-80"
      >
        <Avatar name={nickname} className="text-[3rem]" />
        <div className="flex min-w-0 flex-1 flex-col gap-[0.1875rem] self-stretch">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[0.8875rem] font-bold text-ink">
              {nickname} 손해사정사
            </p>
            {isVerified && (
              <span className="shrink-0">
                <ShieldCheck className="size-3.5 text-green" />
                <span className="sr-only">검증된 손해사정사</span>
              </span>
            )}
            {isNew && (
              <span className="ml-auto shrink-0 rounded-[0.3125rem] bg-terra-soft px-[0.4375rem] py-0.5 text-[0.65625rem] font-bold text-terra">
                NEW
              </span>
            )}
          </div>
          {credential && <p className="text-[0.69375rem] text-ink-3">{credential}</p>}
          {rating != null && (
            <div className="flex items-center gap-1 pt-0.5">
              <Star className="size-[0.8125rem] shrink-0 text-gold" />
              <span className="text-[0.78125rem] font-bold text-ink">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </Link>

      {proposalSummary && (
        <div className="rounded-button bg-paper-2 px-3.5 pb-[0.774rem] pt-[0.675rem]">
          <p className="text-[0.79375rem] leading-[1.35rem] text-ink-2">“{proposalSummary}”</p>
        </div>
      )}

      <div className="flex items-stretch gap-2.5">
        <div className="flex min-w-0 flex-1 flex-col gap-[0.1875rem] rounded-[0.625rem] border border-line-2 px-[0.8125rem] py-[0.6875rem]">
          <p className="text-[0.6125rem] text-ink-3">예상 보상 범위 · 참고용</p>
          <p className="font-serif text-[0.9375rem] font-bold text-ink">
            {estimateRange ?? "범위 미제시"}
          </p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[0.1875rem] rounded-[0.625rem] border border-line-2 px-[0.8125rem] py-[0.6875rem]">
          <p className="text-[0.6125rem] text-ink-3">보수 기준</p>
          <p className="text-[0.825rem] font-bold text-ink">{feeBasis ?? "상담 시 안내"}</p>
        </div>
      </div>

      {cardAction === "REQUEST_CONSULT" && (
        <SentProposalActions proposalId={proposalId} onOpenDetail={openReviewReport} />
      )}

      {cardAction === "IN_CONSULT" && (
        <ConsultChatActions
          proposalId={proposalId}
          matchPending={matchProposal.isPending}
          onMatchComplete={openMatchConfirm}
          onOpenDetail={openReviewReport}
        />
      )}

      {cardAction === "DONE" && <MatchedProposalActions proposalId={proposalId} />}

      {cardAction === "ENDED" && (
        <div className="flex items-center justify-between gap-2.5">
          <StatusBadge tone="neutral">종료된 제안</StatusBadge>
          <Button
            variant="outline"
            size="sm"
            className="h-[2.125rem] px-[0.9375rem] py-[0.5625rem] text-[0.83125rem]"
            onClick={openReviewReport}
          >
            상세 보기
          </Button>
        </div>
      )}

      <MatchConfirmModal
        open={confirmOpen}
        adjusterName={nickname}
        endingConsultations={otherProposalNames.map((name) => ({ name }))}
        pending={matchProposal.isPending}
        onConfirm={confirmMatch}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
  );
}

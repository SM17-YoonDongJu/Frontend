"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { Star } from "@/shared/ui/icons/Star";
import { useMatchProposal } from "../../../_shared/api/use-match-proposal";
import { useViewedProposals } from "../_hooks/use-viewed-proposals";
import type { Proposal } from "../../../_shared/model/proposal.schema";

interface ProposalCardProps {
  reportId: string;
  proposal: Proposal;
}

const manWonFormatter = new Intl.NumberFormat("ko-KR");

function formatEstimateRange(min?: number | null, max?: number | null) {
  if (min == null || max == null) return null;
  const toMan = (value: number) => manWonFormatter.format(Math.round(value / 10_000));
  return `${toMan(min)} – ${toMan(max)}만`;
}

function formatCredential(career?: number | null, speciality?: string | null) {
  return [career != null ? `경력 ${career}년` : null, speciality].filter(Boolean).join(" · ");
}

export function ProposalCard({ reportId, proposal }: ProposalCardProps) {
  const router = useRouter();
  const { isViewed, markViewed } = useViewedProposals();
  const matchProposal = useMatchProposal(reportId);

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
  } = proposal;
  const viewed = isViewed(adjusterId);
  const avatarLabel = nickname.trim().charAt(0) || "?";
  const estimateRange = formatEstimateRange(estimateMinAmount, estimateMaxAmount);
  const credential = formatCredential(career, speciality);

  const openReviewReport = () => {
    markViewed(adjusterId);
    router.push(`/customer/report/${reportId}`);
  };

  const acceptConsult = () => {
    matchProposal.mutate({ proposalId, status: "ACCEPTED" });
  };

  return (
    <article
      className={cn(
        "flex flex-col gap-[0.8125rem] rounded-card border border-line bg-card p-[1.1875rem] shadow-[0_1px_1px_rgba(21,32,46,0.03)] transition",
        viewed && "opacity-60",
      )}
    >
      <div className="flex items-start gap-[0.8125rem]">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy font-serif text-[1.2625rem] text-white"
        >
          {avatarLabel}
        </span>
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
          <div className="flex items-center gap-1 pt-0.5">
            <Star className="size-[0.8125rem] shrink-0 text-gold" />
            <span className="text-[0.78125rem] font-bold text-ink">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-button bg-paper-2 px-3.5 pb-[0.774rem] pt-[0.675rem]">
        <p className="text-[0.79375rem] leading-[1.35rem] text-ink-2">“{proposalSummary}”</p>
      </div>

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

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Button
          variant="outline"
          size="sm"
          className="h-[2.125rem] px-[0.9375rem] py-[0.5625rem] text-[0.83125rem]"
          onClick={openReviewReport}
        >
          상세 보기
        </Button>
        <Button
          size="sm"
          loading={matchProposal.isPending}
          icon={<ArrowRight className="text-[0.9375rem]" />}
          className="h-[2.125rem] px-[0.9375rem] py-[0.5625rem] text-[0.8125rem]"
          onClick={acceptConsult}
        >
          상담 수락
        </Button>
      </div>
    </article>
  );
}

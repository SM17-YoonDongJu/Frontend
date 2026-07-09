"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
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

export function ProposalCard({ reportId, proposal }: ProposalCardProps) {
  const router = useRouter();
  const { isViewed, markViewed } = useViewedProposals();
  const matchProposal = useMatchProposal(reportId);

  const {
    proposalId,
    adjusterId,
    nickname,
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

  const openReviewReport = () => {
    markViewed(adjusterId);
    router.push(`/customer/report/${reportId}`);
  };

  const openAdjusterProfile = () => {
    router.push(`/customer/adjusters/${adjusterId}`);
  };

  const handleReject = () => {
    matchProposal.mutate({ proposalId, status: "REJECTED" });
  };

  return (
    <article
      className={cn(
        "rounded-card-lg border border-gold-2 bg-card p-5 transition",
        viewed && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-[17px] font-semibold text-white"
          >
            {avatarLabel}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[15px] font-semibold text-ink">
                {nickname} 손해사정사
              </p>
              {isVerified && <VerifiedIcon />}
              {isNew && (
                <span className="shrink-0 rounded-full bg-terra-soft px-2 py-0.5 text-[11px] font-medium text-terra">
                  신규
                </span>
              )}
            </div>
            {(speciality || career != null) && (
              <p className="mt-0.5 text-[13px] text-ink-3">
                {[speciality, career != null ? `경력 ${career}년` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={openAdjusterProfile}
          className="shrink-0 text-[13px] text-ink-3 transition hover:text-ink"
        >
          프로필 보기
        </button>
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-ink-2">“{proposalSummary}”</p>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div className="flex min-w-0 gap-8">
          <div className="min-w-0">
            <p className="text-[12px] text-ink-3">이 사정사의 검토 범위 · 참고용</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">
              {estimateRange ?? "범위 미제시"}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] text-ink-3">보수 기준</p>
            <p className="mt-1 text-[15px] font-semibold text-ink">{feeBasis ?? "상담 시 안내"}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            loading={matchProposal.isPending}
            onClick={handleReject}
          >
            거절
          </Button>
          <Button
            size="sm"
            icon={<ArrowRightIcon />}
            className="bg-gold-soft text-gold-ink"
            onClick={openReviewReport}
          >
            검수 의견 보기
          </Button>
        </div>
      </div>
    </article>
  );
}

function VerifiedIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-gold"
      aria-label="검증된 손해사정사"
    >
      <path d="M12 2l2.6 1.9 3.2-.1 1 3.1 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3.1-3.2-.1L12 22l-2.6-1.9-3.2.1-1-3.1L2.6 15.1l1-3.1-1-3.1 2.6-1.9 1-3.1 3.2.1z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

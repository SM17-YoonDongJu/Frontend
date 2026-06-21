"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import { useRejectProposal } from "../_api/use-reject-proposal";
import { useViewedProposals } from "../_hooks/use-viewed-proposals";
import type { Proposal } from "../_model/proposal.schema";

interface ProposalCardProps {
  reportId: string;
  proposal: Proposal;
}

const submittedAtFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function formatSubmittedAt(submittedAt: string) {
  const date = new Date(submittedAt);
  if (Number.isNaN(date.getTime())) return submittedAt;
  return submittedAtFormatter.format(date);
}

export function ProposalCard({ reportId, proposal }: ProposalCardProps) {
  const router = useRouter();
  const { isViewed, markViewed } = useViewedProposals();
  const rejectProposal = useRejectProposal(reportId);

  const { adjusterId, nickname, rating, proposalSummary, submittedAt } = proposal;
  const viewed = isViewed(adjusterId);
  const avatarLabel = nickname.trim().charAt(0) || "?";

  const openReviewReport = () => {
    markViewed(adjusterId);
    router.push(`/customer/report/${reportId}`);
  };

  return (
    <article
      className={cn(
        "rounded-card-lg border border-line bg-card p-5 transition",
        viewed && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[16px] font-semibold text-ink-2"
          >
            {avatarLabel}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-ink">{nickname}</p>
            <p className="mt-0.5 text-[13px] text-ink-3">평점 {rating.toFixed(1)}</p>
          </div>
        </div>
        <button
          type="button"
          disabled
          aria-label="프로필 보기 (준비 중)"
          className="shrink-0 text-[13px] text-ink-3 disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          프로필 보기
        </button>
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-ink-2">“{proposalSummary}”</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-[12.5px] text-ink-3">제출 {formatSubmittedAt(submittedAt)}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            loading={rejectProposal.isPending}
            onClick={() => rejectProposal.mutate(adjusterId)}
          >
            거절
          </Button>
          <Button size="sm" icon={<ArrowRightIcon />} onClick={openReviewReport}>
            검수 의견 보기
          </Button>
        </div>
      </div>
    </article>
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

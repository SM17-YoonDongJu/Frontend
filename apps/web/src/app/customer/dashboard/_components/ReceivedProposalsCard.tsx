"use client";

import Link from "next/link";
import { useProposalList } from "@/app/customer/proposals/[reportId]/_api/use-proposal-list";
import { useReportList } from "../_api/use-report-list";
import { useLatestProposableReport } from "../_hooks/use-latest-proposable-report";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
import { EmptyState } from "./EmptyState";

const VISIBLE_PROPOSAL_COUNT = 2;

export function ReceivedProposalsCard() {
  const { data: reportList } = useReportList();
  const reportId = useLatestProposableReport(reportList.list);

  return (
    <section>
      <h2 className="mb-4 font-serif text-[20px] font-bold text-ink">받은 제안</h2>
      {reportId === null ? (
        <EmptyState message="받은 제안이 없어요" />
      ) : (
        <ProposalsPreview reportId={reportId} />
      )}
    </section>
  );
}

function ProposalsPreview({ reportId }: { reportId: string }) {
  const { data: proposalList } = useProposalList(reportId);
  const proposals = proposalList.list.slice(0, VISIBLE_PROPOSAL_COUNT);
  const newCount = proposalList.list.filter((proposal) => proposal.isNew).length;

  if (proposals.length === 0) {
    return <EmptyState message="받은 제안이 없어요" />;
  }

  return (
    <div className="rounded-card border border-line bg-card p-5">
      <div className="flex flex-col gap-3">
        {proposals.map((proposal) => (
          <Link
            key={proposal.adjusterId}
            href={DASHBOARD_LINKS.proposals(reportId)}
            className="flex items-center gap-3 rounded-card border border-line-2 p-3 transition hover:bg-paper-2"
          >
            <span
              aria-hidden
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-[15px] font-semibold text-white"
            >
              {proposal.nickname.trim().charAt(0) || "?"}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[14px] font-semibold text-ink">
                  {proposal.nickname} 손해사정사
                </p>
                {proposal.isNew && (
                  <span className="shrink-0 rounded-full bg-terra-soft px-2 py-0.5 text-[11px] font-medium text-terra">
                    신규
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-ink-3">
                {proposal.speciality && (
                  <span className="truncate">{proposal.speciality}</span>
                )}
                <span className="shrink-0 text-gold" aria-label={`평점 ${proposal.rating}점`}>
                  ★ {proposal.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href={DASHBOARD_LINKS.proposals(reportId)}
        className="mt-4 flex items-center justify-between text-[13px] font-semibold text-gold-ink transition hover:brightness-[.96]"
      >
        <span>받은 제안 전체 보기</span>
        {newCount > 0 && (
          <span className="rounded-full bg-terra-soft px-2 py-0.5 text-[11px] text-terra">
            신규 {newCount}
          </span>
        )}
      </Link>
    </div>
  );
}

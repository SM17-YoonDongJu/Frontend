"use client";

import Link from "next/link";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { useProposalList } from "@/app/customer/_shared/api/use-proposal-list";
import { useReportList } from "../_api/use-report-list";
import { useLatestProposableReport } from "../_hooks/use-latest-proposable-report";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
import { EmptyState } from "./EmptyState";

const VISIBLE_PROPOSAL_COUNT = 2;

export function ReceivedProposalsCard() {
  const { data: reportList } = useReportList();
  const reportId = useLatestProposableReport(reportList.list);
  const count =
    reportList.list.find((report) => report.reportId === reportId)?.proposalCount ?? 0;

  if (reportId === null) {
    return (
      <section className="rounded-card border border-line bg-card p-[1.4375rem]">
        <Header count={0} />
        <div className="mt-3">
          <EmptyState message="받은 제안이 없어요" />
        </div>
      </section>
    );
  }

  return <ProposalsPreview reportId={reportId} count={count} />;
}

function ProposalsPreview({ reportId, count }: { reportId: string; count: number }) {
  const { data: proposalList } = useProposalList(reportId);
  const proposals = proposalList.list.slice(0, VISIBLE_PROPOSAL_COUNT);

  return (
    <section className="rounded-card border border-line bg-card p-[1.4375rem]">
      <Header count={count} />
      <div className="mt-2 flex flex-col">
        {proposals.map((proposal, index) => (
          <Link
            key={proposal.adjusterId}
            href={DASHBOARD_LINKS.proposals(reportId)}
            className={`flex items-center gap-[0.6875rem] py-[0.8125rem] transition hover:opacity-80 ${index > 0 ? "border-t border-line-2" : ""}`}
          >
            <span
              aria-hidden
              className="flex size-[2.125rem] shrink-0 items-center justify-center rounded-full bg-navy font-serif text-[0.9rem] text-white"
            >
              {proposal.nickname.trim().charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.84375rem] font-bold text-ink">
                {proposal.nickname} 사정사
              </p>
              {proposal.speciality && (
                <p className="truncate text-[0.71875rem] text-ink-3">{proposal.speciality}</p>
              )}
            </div>
            <ChevronRight className="shrink-0 text-[0.9375rem] text-ink-3" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function Header({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[0.96875rem] font-bold text-ink">받은 제안</h2>
      {count > 0 && (
        <span className="rounded-full bg-terra px-[0.5625rem] py-0.5 text-[0.71875rem] font-bold text-white">
          {count}
        </span>
      )}
    </div>
  );
}

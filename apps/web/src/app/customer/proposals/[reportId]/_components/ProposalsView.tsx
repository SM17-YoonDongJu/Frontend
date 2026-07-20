"use client";

import { useProposalList } from "../../../_shared/api/use-proposal-list";
import { AnalysisTargetCard } from "./AnalysisTargetCard";
import { ProposalList } from "./ProposalList";

export function ProposalsView({ reportId }: { reportId: string }) {
  const { data: proposalList } = useProposalList(reportId);

  const { target } = proposalList;
  const proposals = proposalList.list;
  const proposalCount = proposalList.pagination.totalElements;
  const newCount = proposals.filter((proposal) => proposal.isNew).length;

  return (
    <div className="mx-auto w-full max-w-[47.5rem] px-5 py-8">
      <div className="flex items-center gap-2.5">
        <h1 className="font-serif text-[1.625rem] font-bold leading-tight text-ink">받은 제안</h1>
        {newCount > 0 && (
          <span className="rounded-pill bg-terra px-2.5 py-1 text-[0.75rem] font-bold text-white">
            신규 {newCount}
          </span>
        )}
      </div>
      <p className="mt-2 text-[0.875rem] text-ink-3">
        내 리포트를 검토한 손해사정사들의 상담 제안이에요.
      </p>

      {target && (
        <div className="mt-6">
          <AnalysisTargetCard
            reportId={reportId}
            accidentType={target.accidentType}
            reportNo={target.reportNo}
            proposalCount={proposalCount}
          />
        </div>
      )}

      <div className="mt-6">
        <ProposalList reportId={reportId} proposals={proposals} />
      </div>

      <p className="mt-8 rounded-card border border-line bg-paper-2 px-4 py-3 text-[0.78125rem] leading-relaxed text-ink-3">
        검토 범위는 추정·참고용이며 결과를 보장하지 않습니다. 상담은 해당 손해사정사에게
        전달되며, 검토 의견은 가입자님의 판단을 돕기 위한 참고 자료입니다.
      </p>
    </div>
  );
}

import type { Proposal } from "../../../_shared/model/proposal.schema";
import { ProposalCard } from "./ProposalCard";

interface ProposalListProps {
  reportId: string;
  proposals: Proposal[];
}

export function ProposalList({ reportId, proposals }: ProposalListProps) {
  if (proposals.length === 0) {
    return (
      <div className="rounded-card-lg border border-line bg-card px-6 py-16 text-center">
        <p className="text-[1rem] font-semibold text-ink">아직 도착한 제안이 없어요</p>
        <p className="mt-2 text-[0.875rem] text-ink-3">
          손해사정사가 검수 의견을 보내면 이곳에 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {proposals.map((proposal) => (
        <li key={proposal.adjusterId}>
          <ProposalCard reportId={reportId} proposal={proposal} />
        </li>
      ))}
    </ul>
  );
}

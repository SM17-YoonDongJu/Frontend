"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { ProposalsSkeleton } from "./ProposalsSkeleton";
import { ProposalsView } from "./ProposalsView";
import { ViewedProposalsProvider } from "../_hooks/use-viewed-proposals";

export function ProposalsBoundary({ reportId }: { reportId: string }) {
  return (
    <ViewedProposalsProvider>
      <AsyncBoundary
        fallback={<ProposalsSkeleton />}
        errorLayout="page"
        errorTitle="제안을 불러오지 못했어요"
      >
        <ProposalsView reportId={reportId} />
      </AsyncBoundary>
    </ViewedProposalsProvider>
  );
}

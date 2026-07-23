"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { ReceivedProposalsSkeleton } from "./ReceivedProposalsSkeleton";
import { ReceivedProposalsView } from "./ReceivedProposalsView";

const ERROR_MESSAGES = {
  FORBIDDEN: {
    title: "접근 권한이 없어요",
    desc: "본인 리포트만 확인할 수 있어요.",
  },
};

export function ReceivedProposalsBoundary() {
  return (
    <AsyncBoundary
      fallback={<ReceivedProposalsSkeleton />}
      errorLayout="flow"
      errorTitle="제안을 불러오지 못했어요"
      errorMessages={ERROR_MESSAGES}
    >
      <ReceivedProposalsView />
    </AsyncBoundary>
  );
}

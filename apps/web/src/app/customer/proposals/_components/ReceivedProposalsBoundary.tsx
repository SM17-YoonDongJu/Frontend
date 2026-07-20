"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { ReceivedProposalsSkeleton } from "./ReceivedProposalsSkeleton";
import { ReceivedProposalsView } from "./ReceivedProposalsView";

const ERROR_MESSAGES = {
  LOGIN_REQUIRED: {
    title: "로그인이 필요해요",
    desc: "다시 로그인한 뒤 시도해 주세요.",
  },
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

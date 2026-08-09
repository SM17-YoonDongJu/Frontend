"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { ReportListSkeleton } from "./ReportListSkeleton";
import { ReportListView } from "./ReportListView";

const ERROR_MESSAGES = {
  FORBIDDEN: {
    title: "접근 권한이 없어요",
    desc: "본인 리포트만 확인할 수 있어요.",
  },
};

export function ReportListBoundary() {
  return (
    <AsyncBoundary
      fallback={<ReportListSkeleton />}
      errorLayout="flow"
      errorTitle="리포트를 불러오지 못했어요"
      errorMessages={ERROR_MESSAGES}
    >
      <ReportListView />
    </AsyncBoundary>
  );
}

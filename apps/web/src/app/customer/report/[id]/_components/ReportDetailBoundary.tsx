"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { ReportDetailSkeleton } from "./ReportDetailSkeleton";
import { ReportDetailView } from "./ReportDetailView";

const ERROR_MESSAGES = {
  POST_NOT_FOUND: { title: "리포트를 찾을 수 없어요", desc: "삭제되었거나 잘못된 주소예요." },
  FORBIDDEN: { title: "접근 권한이 없어요", desc: "본인 리포트만 확인할 수 있어요." },
};

export function ReportDetailBoundary({ reportId }: { reportId: string }) {
  return (
    <AsyncBoundary
      fallback={<ReportDetailSkeleton />}
      errorLayout="page"
      errorTitle="리포트를 불러오지 못했어요"
      errorMessages={ERROR_MESSAGES}
    >
      <ReportDetailView reportId={reportId} />
    </AsyncBoundary>
  );
}

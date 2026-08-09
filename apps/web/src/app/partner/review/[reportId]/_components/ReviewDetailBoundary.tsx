"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { ReviewDetailSkeleton } from "./ReviewDetailSkeleton";
import { ReviewDetailView } from "./ReviewDetailView";

const ERROR_MESSAGES = {
  POST_NOT_FOUND: { title: "검수 리포트를 찾을 수 없어요", desc: "삭제되었거나 잘못된 주소예요." },
  FORBIDDEN: { title: "접근 권한이 없어요", desc: "배정된 사정사만 검수할 수 있어요." },
};

export function ReviewDetailBoundary({ reportId }: { reportId: string }) {
  return (
    <AsyncBoundary
      fallback={<ReviewDetailSkeleton />}
      errorLayout="page"
      errorTitle="검수 리포트를 불러오지 못했어요"
      errorMessages={ERROR_MESSAGES}
    >
      <ReviewDetailView reportId={reportId} />
    </AsyncBoundary>
  );
}

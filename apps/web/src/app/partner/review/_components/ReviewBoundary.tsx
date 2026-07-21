"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { ReviewResults } from "./ReviewResults";
import { ReviewSkeleton } from "./ReviewSkeleton";
import { REVIEW_ERROR_MESSAGES } from "./review-error-messages";

export function ReviewBoundary() {
  return (
    <AsyncBoundary
      fallback={<ReviewSkeleton />}
      errorLayout="page"
      errorTitle="목록을 불러오지 못했어요"
      errorMessages={REVIEW_ERROR_MESSAGES}
    >
      <ReviewResults />
    </AsyncBoundary>
  );
}

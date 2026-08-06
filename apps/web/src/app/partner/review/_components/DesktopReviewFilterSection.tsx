"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { DesktopReviewFilterSectionSkeleton } from "./DesktopReviewFilterSectionSkeleton";
import { DesktopReviewResults } from "./DesktopReviewResults";
import { REVIEW_ERROR_MESSAGES } from "./review-error-messages";

export function DesktopReviewFilterSection() {
  return (
    <AsyncBoundary
      fallback={<DesktopReviewFilterSectionSkeleton />}
      errorLayout="page"
      errorTitle="목록을 불러오지 못했어요"
      errorMessages={REVIEW_ERROR_MESSAGES}
    >
      <DesktopReviewResults />
    </AsyncBoundary>
  );
}

"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { DesktopReviewSkeleton } from "./DesktopReviewSkeleton";
import { DesktopReviewView } from "./DesktopReviewView";
import { REVIEW_ERROR_MESSAGES } from "./review-error-messages";

export function DesktopReviewBoundary() {
  return (
    <AsyncBoundary
      fallback={<DesktopReviewSkeleton />}
      errorLayout="page"
      errorTitle="목록을 불러오지 못했어요"
      errorMessages={REVIEW_ERROR_MESSAGES}
    >
      <DesktopReviewView />
    </AsyncBoundary>
  );
}

"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { DesktopReviewView } from "./DesktopReviewView";
import { REVIEW_ERROR_MESSAGES } from "./review-error-messages";

function DesktopReviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-card-lg bg-line-2" />
        <div className="h-24 animate-pulse rounded-card-lg bg-line-2" />
        <div className="h-24 animate-pulse rounded-card-lg bg-line-2" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_24.5rem]">
        <div className="space-y-3">
          <div className="h-36 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-36 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-36 animate-pulse rounded-card-lg bg-line-2" />
        </div>
        <div className="h-96 animate-pulse rounded-card-lg bg-line-2" />
      </div>
    </div>
  );
}

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

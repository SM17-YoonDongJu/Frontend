"use client";

import { AsyncBoundary } from "@/shared/ui/AsyncBoundary";
import { PendingReviewPreview } from "./PendingReviewPreview";
import { PendingReviewSkeleton } from "./PendingReviewSkeleton";

export function PendingReviewBoundary() {
  return (
    <AsyncBoundary fallback={<PendingReviewSkeleton />} errorLayout="card">
      <PendingReviewPreview />
    </AsyncBoundary>
  );
}

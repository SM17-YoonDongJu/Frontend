"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { SectionError } from "./SectionError";
import { PendingReviewPreview } from "./PendingReviewPreview";
import { PendingReviewSkeleton } from "./PendingReviewSkeleton";

export function PendingReviewBoundary() {
  if (!useHydrated()) return <PendingReviewSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <SectionError onRetry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PendingReviewSkeleton />}>
            <PendingReviewPreview />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

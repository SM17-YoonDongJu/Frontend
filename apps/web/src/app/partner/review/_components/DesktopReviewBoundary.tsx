"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DesktopReviewView } from "./DesktopReviewView";
import { ReviewError } from "./ReviewError";
import type { FallbackProps } from "react-error-boundary";

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

function DesktopReviewErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return <ReviewError code={(error as Error).name} onRetry={resetErrorBoundary} />;
}

export function DesktopReviewBoundary() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <DesktopReviewSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={DesktopReviewErrorFallback}>
          <Suspense fallback={<DesktopReviewSkeleton />}>
            <DesktopReviewView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

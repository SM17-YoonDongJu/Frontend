"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { SectionError } from "./SectionError";
import { ActivityStats } from "./ActivityStats";
import { ActivitySkeleton } from "./ActivitySkeleton";
import type { FallbackProps } from "react-error-boundary";

function ActivityErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return <SectionError onRetry={resetErrorBoundary} />;
}

export function ActivityBoundary() {
  if (!useHydrated()) return <ActivitySkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={ActivityErrorFallback}
        >
          <Suspense fallback={<ActivitySkeleton />}>
            <ActivityStats />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { FallbackProps } from "react-error-boundary";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { SectionError } from "./SectionError";
import { InProgressCases } from "./InProgressCases";
import { InProgressSkeleton } from "./InProgressSkeleton";

function InProgressErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return <SectionError onRetry={resetErrorBoundary} />;
}

export function InProgressBoundary() {
  if (!useHydrated()) return <InProgressSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={InProgressErrorFallback}
        >
          <Suspense fallback={<InProgressSkeleton />}>
            <InProgressCases />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

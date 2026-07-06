"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { SectionError } from "./SectionError";
import { MobileSummaryGrid } from "./MobileSummaryGrid";
import { MobileSummarySkeleton } from "./MobileSummarySkeleton";
import type { FallbackProps } from "react-error-boundary";

function MobileSummaryErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return <SectionError onRetry={resetErrorBoundary} />;
}

export function MobileSummaryBoundary() {
  if (!useHydrated()) return <MobileSummarySkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={MobileSummaryErrorFallback}>
          <Suspense fallback={<MobileSummarySkeleton />}>
            <MobileSummaryGrid />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

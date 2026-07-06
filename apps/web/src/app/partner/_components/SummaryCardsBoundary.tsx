"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { SectionError } from "./SectionError";
import { SummaryCards } from "./SummaryCards";
import { SummaryCardsSkeleton } from "./SummaryCardsSkeleton";
import type { FallbackProps } from "react-error-boundary";

function SummaryCardsErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="md:col-span-4">
      <SectionError onRetry={resetErrorBoundary} />
    </div>
  );
}

export function SummaryCardsBoundary() {
  if (!useHydrated()) return <SummaryCardsSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={SummaryCardsErrorFallback}
        >
          <Suspense fallback={<SummaryCardsSkeleton />}>
            <SummaryCards />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { SectionError } from "./SectionError";
import { SummaryCards } from "./SummaryCards";
import { SummaryCardsSkeleton } from "./SummaryCardsSkeleton";

export function SummaryCardsBoundary() {
  if (!useHydrated()) return <SummaryCardsSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div className="md:col-span-4">
              <SectionError onRetry={resetErrorBoundary} />
            </div>
          )}
        >
          <Suspense fallback={<SummaryCardsSkeleton />}>
            <SummaryCards />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

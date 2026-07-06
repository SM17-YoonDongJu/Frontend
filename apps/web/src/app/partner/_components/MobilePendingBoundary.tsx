"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { SectionError } from "./SectionError";
import { MobilePendingList } from "./MobilePendingList";
import { MobilePendingSkeleton } from "./MobilePendingSkeleton";
import type { FallbackProps } from "react-error-boundary";

function MobilePendingErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return <SectionError onRetry={resetErrorBoundary} />;
}

export function MobilePendingBoundary() {
  if (!useHydrated()) return <MobilePendingSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={MobilePendingErrorFallback}>
          <Suspense fallback={<MobilePendingSkeleton />}>
            <MobilePendingList />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

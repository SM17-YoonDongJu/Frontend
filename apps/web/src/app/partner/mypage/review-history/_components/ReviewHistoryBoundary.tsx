"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { ReviewHistoryError } from "./ReviewHistoryError";
import { ReviewHistorySkeleton } from "./ReviewHistorySkeleton";
import { ReviewHistoryView } from "./ReviewHistoryView";

function ReviewHistoryErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return <ReviewHistoryError code={(error as Error).name} onRetry={resetErrorBoundary} />;
}

export function ReviewHistoryBoundary() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ReviewHistorySkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ReviewHistoryErrorFallback}>
          <Suspense fallback={<ReviewHistorySkeleton />}>
            <ReviewHistoryView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

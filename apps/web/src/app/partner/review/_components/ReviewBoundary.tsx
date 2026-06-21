"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReviewError } from "./ReviewError";
import { ReviewSkeleton } from "./ReviewSkeleton";
import { ReviewView } from "./ReviewView";

export function ReviewBoundary() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ReviewSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ReviewError code={(error as Error).name} onRetry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<ReviewSkeleton />}>
            <ReviewView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

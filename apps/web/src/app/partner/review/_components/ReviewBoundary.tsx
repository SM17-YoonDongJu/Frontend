"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReviewError } from "./ReviewError";
import { ReviewSkeleton } from "./ReviewSkeleton";
import { ReviewView } from "./ReviewView";
import type { FallbackProps } from "react-error-boundary";

function ReviewErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return <ReviewError code={(error as Error).name} onRetry={resetErrorBoundary} />;
}

export function ReviewBoundary() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ReviewSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={ReviewErrorFallback}
        >
          <Suspense fallback={<ReviewSkeleton />}>
            <ReviewView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

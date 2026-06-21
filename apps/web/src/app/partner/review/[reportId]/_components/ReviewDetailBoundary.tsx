"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReviewDetailError } from "./ReviewDetailError";
import { ReviewDetailSkeleton } from "./ReviewDetailSkeleton";
import { ReviewDetailView } from "./ReviewDetailView";

export function ReviewDetailBoundary({ reportId }: { reportId: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ReviewDetailSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ReviewDetailError
              code={(error as Error).name}
              onRetry={resetErrorBoundary}
            />
          )}
        >
          <Suspense fallback={<ReviewDetailSkeleton />}>
            <ReviewDetailView reportId={reportId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

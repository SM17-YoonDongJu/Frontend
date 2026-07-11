"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { ReceivedProposalsError } from "./ReceivedProposalsError";
import { ReceivedProposalsSkeleton } from "./ReceivedProposalsSkeleton";
import { ReceivedProposalsView } from "./ReceivedProposalsView";

function ReceivedProposalsErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return <ReceivedProposalsError code={(error as Error).name} onRetry={resetErrorBoundary} />;
}

export function ReceivedProposalsBoundary() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ReceivedProposalsSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ReceivedProposalsErrorFallback}>
          <Suspense fallback={<ReceivedProposalsSkeleton />}>
            <ReceivedProposalsView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

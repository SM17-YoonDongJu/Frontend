"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ProposalsError } from "./ProposalsError";
import { ProposalsSkeleton } from "./ProposalsSkeleton";
import { ProposalsView } from "./ProposalsView";
import { ViewedProposalsProvider } from "../_hooks/use-viewed-proposals";
import type { FallbackProps } from "react-error-boundary";

function ProposalsErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <ProposalsError code={(error as Error).name} onRetry={resetErrorBoundary} />
  );
}

export function ProposalsBoundary({ reportId }: { reportId: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ProposalsSkeleton />;

  return (
    <ViewedProposalsProvider>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            FallbackComponent={ProposalsErrorFallback}
          >
            <Suspense fallback={<ProposalsSkeleton />}>
              <ProposalsView reportId={reportId} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </ViewedProposalsProvider>
  );
}

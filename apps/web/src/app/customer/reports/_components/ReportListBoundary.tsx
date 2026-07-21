"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { ReportListError } from "./ReportListError";
import { ReportListSkeleton } from "./ReportListSkeleton";
import { ReportListView } from "./ReportListView";

function ReportListErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return <ReportListError code={(error as Error).name} onRetry={resetErrorBoundary} />;
}

export function ReportListBoundary() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ReportListSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ReportListErrorFallback}>
          <Suspense fallback={<ReportListSkeleton />}>
            <ReportListView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReportListErrorFallback } from "./ReportListErrorFallback";
import { ReportListSkeleton } from "./ReportListSkeleton";
import { ReportListView } from "./ReportListView";

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

"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { ErrorState } from "@/shared/ui/ErrorState";
import { ReportListSkeleton } from "./ReportListSkeleton";
import { ReportListView } from "./ReportListView";

function ReportListErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <ErrorState
      layout="page"
      title="리포트를 불러오지 못했어요"
      code={(error as Error).name}
      onRetry={resetErrorBoundary}
    />
  );
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

"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReportDetailError } from "./ReportDetailError";
import { ReportDetailSkeleton } from "./ReportDetailSkeleton";
import { ReportDetailView } from "./ReportDetailView";

export function ReportDetailBoundary({ reportId }: { reportId: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ReportDetailSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ReportDetailError
              code={(error as Error).name}
              onRetry={resetErrorBoundary}
            />
          )}
        >
          <Suspense fallback={<ReportDetailSkeleton />}>
            <ReportDetailView reportId={reportId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

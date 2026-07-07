"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { CustomerReportsError } from "./CustomerReportsError";
import { CustomerReportsSkeleton } from "./CustomerReportsSkeleton";
import { CustomerReportsView } from "./CustomerReportsView";

function CustomerReportsErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return <CustomerReportsError code={(error as Error).name} onRetry={resetErrorBoundary} />;
}

export function CustomerReportsBoundary() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <CustomerReportsSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={CustomerReportsErrorFallback}>
          <Suspense fallback={<CustomerReportsSkeleton />}>
            <CustomerReportsView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

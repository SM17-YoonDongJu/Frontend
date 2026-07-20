"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "@/shared/ui/Button";
import { ReportListSkeleton } from "./ReportListSkeleton";
import { ReportListView } from "./ReportListView";

function ReportListErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="mx-auto flex w-full max-w-[42rem] flex-col items-center px-6 py-20 text-center">
      <h2 className="text-[1.125rem] font-semibold text-ink">리포트를 불러오지 못했어요</h2>
      <p className="mt-2 text-[0.875rem] text-ink-3">잠시 후 다시 시도해 주세요.</p>
      <Button className="mt-5" onClick={resetErrorBoundary}>
        다시 시도
      </Button>
    </div>
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

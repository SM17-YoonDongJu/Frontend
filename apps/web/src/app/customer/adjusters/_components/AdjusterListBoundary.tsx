"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useSyncExternalStore } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AdjusterListError } from "./AdjusterListError";
import { AdjusterListSkeleton } from "./AdjusterListSkeleton";
import { AdjusterListView } from "./AdjusterListView";

const emptySubscribe = () => () => {};

export function AdjusterListBoundary() {
  // SSR·하이드레이션 중에는 스켈레톤을 유지하고 클라이언트에서만 쿼리를 마운트하는 게이트
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  if (!mounted) return <AdjusterListSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <AdjusterListError code={(error as Error).name} onRetry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<AdjusterListSkeleton />}>
            <AdjusterListView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { MypageError } from "./MypageError";
import { MypageSkeleton } from "./MypageSkeleton";
import { MypageView } from "./MypageView";

export function MypageBoundary() {
  if (!useHydrated()) return <MypageSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <MypageError onRetry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<MypageSkeleton />}>
            <MypageView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

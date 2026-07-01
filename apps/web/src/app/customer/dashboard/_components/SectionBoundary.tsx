"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

const noopSubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
import { ErrorBoundary } from "react-error-boundary";
import { SectionError } from "./SectionError";
import { SectionSkeleton } from "./SectionSkeleton";

interface SectionBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorTitle?: string;
}

export function SectionBoundary({
  children,
  fallback,
  errorTitle,
}: SectionBoundaryProps) {
  const mounted = useIsMounted();

  const skeleton = fallback ?? <SectionSkeleton />;
  if (!mounted) return skeleton;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <SectionError
              title={errorTitle}
              code={(error as Error).name}
              onRetry={resetErrorBoundary}
            />
          )}
        >
          <Suspense fallback={skeleton}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

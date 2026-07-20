"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useHydrated } from "@/shared/lib/use-hydrated";
import { ErrorState, type ErrorLayout } from "./ErrorState";

interface AsyncBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  errorLayout: ErrorLayout;
  errorTitle?: string;
  errorMessages?: Record<string, { title: string; desc: string }>;
}

export function AsyncBoundary({
  children,
  fallback,
  errorLayout,
  errorTitle,
  errorMessages,
}: AsyncBoundaryProps) {
  if (!useHydrated()) return fallback;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorState
              layout={errorLayout}
              title={errorTitle}
              code={(error as Error).name}
              messages={errorMessages}
              onRetry={resetErrorBoundary}
            />
          )}
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

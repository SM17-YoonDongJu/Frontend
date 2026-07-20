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
  /** 에러 상태에만 붙는 에지 여백 등. 스켈레톤·성공은 각자 여백을 가지므로 여기서 주입. */
  errorClassName?: string;
}

export function AsyncBoundary({
  children,
  fallback,
  errorLayout,
  errorTitle,
  errorMessages,
  errorClassName,
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
              className={errorClassName}
            />
          )}
        >
          <Suspense fallback={fallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

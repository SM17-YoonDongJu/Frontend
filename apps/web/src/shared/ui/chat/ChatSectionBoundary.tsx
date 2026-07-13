"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useSyncExternalStore, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ChatSectionError } from "./ChatSectionError";

const noopSubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

interface ChatSectionBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  errorTitle?: string;
}

export function ChatSectionBoundary({
  children,
  fallback,
  errorTitle,
}: ChatSectionBoundaryProps) {
  const mounted = useIsMounted();
  if (!mounted) return fallback;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ChatSectionError
              title={errorTitle}
              code={(error as Error).name}
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

"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { NotificationError } from "./NotificationError";
import { NotificationListSkeleton } from "./NotificationListSkeleton";

const noopSubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

interface NotificationBoundaryProps {
  children: ReactNode;
}

export function NotificationBoundary({ children }: NotificationBoundaryProps) {
  const mounted = useIsMounted();

  const skeleton = <NotificationListSkeleton />;
  if (!mounted) return skeleton;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <NotificationError
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

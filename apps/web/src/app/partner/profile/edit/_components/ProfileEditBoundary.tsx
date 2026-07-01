"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ProfileEditError } from "./ProfileEditError";
import { ProfileEditSkeleton } from "./ProfileEditSkeleton";
import { ProfileEditView } from "./ProfileEditView";

export function ProfileEditBoundary() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <ProfileEditSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ProfileEditError code={(error as Error).name} onRetry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<ProfileEditSkeleton />}>
            <ProfileEditView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

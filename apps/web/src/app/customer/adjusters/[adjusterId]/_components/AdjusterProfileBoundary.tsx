"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AdjusterProfileError } from "./AdjusterProfileError";
import { AdjusterProfileSkeleton } from "./AdjusterProfileSkeleton";
import { AdjusterProfileView } from "./AdjusterProfileView";
import type { FallbackProps } from "react-error-boundary";

function AdjusterProfileErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <AdjusterProfileError code={(error as Error).name} onRetry={resetErrorBoundary} />
  );
}

export function AdjusterProfileBoundary({ adjusterId }: { adjusterId: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <AdjusterProfileSkeleton />;

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={AdjusterProfileErrorFallback}
        >
          <Suspense fallback={<AdjusterProfileSkeleton />}>
            <AdjusterProfileView adjusterId={adjusterId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

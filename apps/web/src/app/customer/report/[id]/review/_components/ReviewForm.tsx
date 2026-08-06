"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ReviewErrorFallback } from "./ReviewErrorFallback";
import { ReviewFormInner } from "./ReviewFormInner";
import { ReviewFormSkeleton } from "./ReviewFormSkeleton";
import { ReviewHeader } from "./ReviewHeader";

export function ReviewForm({ reportId }: { reportId: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto flex w-full max-w-[40rem] flex-col gap-6 px-4 py-6 lg:py-10">
      <ReviewHeader reportId={reportId} />
      {!mounted ? (
        <ReviewFormSkeleton />
      ) : (
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} FallbackComponent={ReviewErrorFallback}>
              <Suspense fallback={<ReviewFormSkeleton />}>
                <ReviewFormInner reportId={reportId} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ReviewError } from "./_components/ReviewError";

export default function ReviewRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[25.125rem] bg-paper">
      <ReviewError code={error.name} onRetry={reset} />
    </div>
  );
}

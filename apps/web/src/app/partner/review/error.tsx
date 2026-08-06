"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { ErrorState } from "@/shared/ui/ErrorState";
import { REVIEW_ERROR_MESSAGES } from "./_components/review-error-messages";

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
      <ErrorState
        layout="page"
        title="목록을 불러오지 못했어요"
        code={error.name}
        messages={REVIEW_ERROR_MESSAGES}
        onRetry={reset}
      />
    </div>
  );
}

"use client";

import { ReviewError } from "./_components/ReviewError";

export default function ReviewRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[24.375rem] bg-paper">
      <ReviewError code={error.name} onRetry={reset} />
    </div>
  );
}

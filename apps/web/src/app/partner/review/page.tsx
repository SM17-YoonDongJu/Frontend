import { Suspense } from "react";
import { ReviewSkeleton } from "./_components/ReviewSkeleton";
import { ReviewView } from "./_components/ReviewView";

export default function ReviewPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[24.375rem] flex-col bg-paper pb-8">
      <Suspense fallback={<ReviewSkeleton />}>
        <ReviewView />
      </Suspense>
    </div>
  );
}

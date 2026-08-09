import { Suspense } from "react";
import { DesktopReviewBoundary } from "./_components/DesktopReviewBoundary";
import { ReviewSkeleton } from "./_components/ReviewSkeleton";
import { ReviewView } from "./_components/ReviewView";

export default function ReviewPage() {
  return (
    <>
      <div className="mx-auto flex min-h-dvh w-full max-w-[25.125rem] flex-col bg-paper pb-8 md:hidden">
        <Suspense fallback={<ReviewSkeleton />}>
          <ReviewView />
        </Suspense>
      </div>

      <div className="mx-auto hidden w-full max-w-[75rem] px-10 py-8 md:block">
        <p className="text-[0.8125rem] font-semibold tracking-[0.08em] text-gold-ink">
          AI 초안 검수
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-ink">검수 대기 리포트</h1>
        <p className="mt-3 text-sm text-ink-3">AI가 작성한 초안을 골라 검토하고, 의뢰를 수락하세요.</p>

        <div className="mt-6">
          <DesktopReviewBoundary />
        </div>
      </div>
    </>
  );
}

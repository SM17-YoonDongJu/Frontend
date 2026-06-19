import { ReviewBoundary } from "./_components/ReviewBoundary";

export default function ReviewPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <h1 className="font-serif text-2xl font-bold text-ink">검수 대기 리포트</h1>
      <p className="mt-1 text-sm text-ink-3">
        AI가 작성한 초안을 골라 검토하고, 의뢰를 수락하세요.
      </p>
      <div className="mt-6">
        <ReviewBoundary />
      </div>
    </div>
  );
}

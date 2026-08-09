import type { FallbackProps } from "react-error-boundary";

export function ReviewErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-[0.9375rem] text-ink-2">리뷰 화면을 불러오지 못했어요.</p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="rounded-button border border-line px-4 py-2 text-[0.875rem] font-bold text-ink transition hover:bg-paper-2"
      >
        다시 시도
      </button>
    </div>
  );
}

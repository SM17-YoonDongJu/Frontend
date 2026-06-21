import { Button } from "@/shared/ui/Button";

export function PendingReviewError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-card-lg border border-line bg-card px-6 py-16 text-center">
      <h2 className="text-[16px] font-semibold text-ink">목록을 불러오지 못했어요</h2>
      <p className="mt-2 text-[13.5px] text-ink-3">잠시 후 다시 시도해 주세요.</p>
      <Button className="mt-5" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

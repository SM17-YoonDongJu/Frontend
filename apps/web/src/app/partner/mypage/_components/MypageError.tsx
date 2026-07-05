import { Button } from "@/shared/ui/Button";

export function MypageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mt-5.5 flex flex-col items-center rounded-card-lg border border-line bg-card px-6 py-12 text-center">
      <h2 className="text-[0.9375rem] font-semibold text-ink">내 정보를 불러오지 못했어요</h2>
      <p className="mt-1 text-[0.8125rem] text-ink-3">잠시 후 다시 시도해 주세요.</p>
      <Button size="sm" variant="outline" className="mt-4" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

import { Button } from "@/shared/ui/Button";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";

export function ReportListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-[42rem] flex-col items-center px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-terra-soft text-terra">
        <AlertTriangle className="text-[1.5rem]" />
      </span>
      <h2 className="mt-5 font-serif text-[1.25rem] font-bold text-ink">리포트를 불러오지 못했어요</h2>
      <p className="mt-2 text-[0.875rem] leading-[1.5] text-ink-3">잠시 후 다시 시도해 주세요.</p>
      <Button className="mt-6" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

import { Button } from "@/shared/ui/Button";

export function ProposalsError({ code, onRetry }: { code?: string; onRetry: () => void }) {
  void code;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h2 className="text-[1.125rem] font-semibold text-ink">제안을 불러오지 못했어요</h2>
      <p className="mt-2 text-[0.875rem] text-ink-3">잠시 후 다시 시도해 주세요.</p>
      <Button className="mt-5" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

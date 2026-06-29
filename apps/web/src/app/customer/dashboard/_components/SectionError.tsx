import { Button } from "@/shared/ui/Button";

interface SectionErrorProps {
  title?: string;
  code?: string;
  onRetry: () => void;
}

export function SectionError({ title, code, onRetry }: SectionErrorProps) {
  return (
    <div className="flex flex-col items-center rounded-card border border-line bg-card px-6 py-10 text-center">
      <h3 className="text-[15px] font-semibold text-ink">
        {title ?? "정보를 불러오지 못했어요"}
      </h3>
      <p className="mt-1.5 text-[13px] text-ink-3">잠시 후 다시 시도해 주세요.</p>
      {code && <p className="mt-1 text-[12px] text-ink-3">({code})</p>}
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

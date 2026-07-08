import { Button } from "@/shared/ui/Button";

interface NotificationErrorProps {
  code?: string;
  onRetry: () => void;
}

export function NotificationError({ code, onRetry }: NotificationErrorProps) {
  return (
    <div
      role="alert"
      className="mx-5 mt-5 flex flex-col items-center rounded-card border border-line bg-card px-6 py-10 text-center"
    >
      <h3 className="text-[0.9375rem] font-semibold text-ink">
        알림을 불러오지 못했어요
      </h3>
      <p className="mt-1.5 text-[0.8125rem] text-ink-3">잠시 후 다시 시도해 주세요.</p>
      {code && <p className="mt-1 text-[0.75rem] text-ink-3">({code})</p>}
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

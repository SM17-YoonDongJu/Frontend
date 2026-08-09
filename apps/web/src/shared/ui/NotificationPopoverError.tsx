import { Button } from "@/shared/ui/Button";

interface NotificationPopoverErrorProps {
  code?: string;
  onRetry: () => void;
}

export function NotificationPopoverError({ code, onRetry }: NotificationPopoverErrorProps) {
  return (
    <div role="alert" className="flex flex-col items-center px-6 py-8 text-center">
      <p className="text-[0.8125rem] font-semibold text-ink">알림을 불러오지 못했어요</p>
      {code && <p className="mt-1 text-[0.71875rem] text-ink-3">({code})</p>}
      <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

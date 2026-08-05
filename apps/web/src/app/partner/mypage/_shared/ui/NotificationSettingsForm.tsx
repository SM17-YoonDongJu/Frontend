"use client";

import { Button } from "@/shared/ui/Button";
import { useNotificationSettings } from "@/shared/api/use-notification-settings";
import { NotificationSettingsFields } from "./NotificationSettingsFields";

export interface NotificationSettingsFormProps {
  /** 저장 성공 시 (모달 닫기 / 페이지 뒤로가기) */
  onComplete: () => void;
  onCancel: () => void;
}

export function NotificationSettingsForm({
  onComplete,
  onCancel,
}: NotificationSettingsFormProps) {
  const { data, isPending, isError, refetch } = useNotificationSettings();

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-13 animate-pulse rounded-card bg-line-2" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <p className="text-[0.875rem] text-ink-2">알림 설정을 불러오지 못했어요.</p>
        <Button size="sm" variant="outline" className="mt-3" onClick={() => refetch()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return <NotificationSettingsFields initial={data} onComplete={onComplete} onCancel={onCancel} />;
}

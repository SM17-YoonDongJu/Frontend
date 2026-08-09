"use client";

import { useState } from "react";
import { useUpdateNotificationSettings } from "@/shared/api/use-update-notification-settings";
import type {
  NotificationSettings,
  UpdateNotificationSettingsBody,
} from "@/shared/model/notification-settings.schema";
import { Button } from "@/shared/ui/Button";
import { Toggle } from "@/shared/ui/Toggle";
import { MessageBubble } from "@/shared/ui/icons/MessageBubble";
import type { NotificationSettingsFormProps } from "./NotificationSettingsForm";

// 사정사 노출 토글 — 라벨·설명은 Figma 146-4640 문구 그대로
const ADJUSTER_ROWS = [
  {
    key: "newReviewRequest",
    title: "새 검수 요청",
    description: "전문 분야에 맞는 사건이 배정되면 알려드려요",
  },
  {
    key: "consultMessage",
    title: "고객 상담 신청 · 메시지",
    description: "신청과 새 메시지를 실시간으로",
  },
  {
    key: "settlementNotice",
    title: "정산 · 공지",
    description: "월 정산 내역과 서비스 공지",
  },
] as const;

export function NotificationSettingsFields({
  initial,
  onComplete,
  onCancel,
}: NotificationSettingsFormProps & { initial: NotificationSettings }) {
  const [draft, setDraft] = useState(initial);
  const mutation = useUpdateNotificationSettings();

  const handleSave = () => {
    const body: UpdateNotificationSettingsBody = {};
    for (const { key } of ADJUSTER_ROWS) {
      if (draft[key] !== initial[key]) body[key] = draft[key];
    }
    if (Object.keys(body).length === 0) {
      onComplete();
      return;
    }
    mutation.mutate(body, { onSuccess: onComplete });
  };

  return (
    <div>
      <div className="divide-y divide-line-2">
        {ADJUSTER_ROWS.map((row) => (
          <div key={row.key} className="py-3.5 first:pt-0">
            <Toggle
              checked={draft[row.key]}
              onChange={(checked) => setDraft((prev) => ({ ...prev, [row.key]: checked }))}
              className="w-full justify-between"
              label={
                <span className="min-w-0 text-left">
                  <span className="block text-[0.875rem] font-semibold text-ink">
                    {row.title}
                  </span>
                  <span className="mt-0.5 block text-[0.75rem] text-ink-3">
                    {row.description}
                  </span>
                </span>
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-1 flex items-center gap-2 rounded-card bg-paper-2 px-3.5 py-3 text-[0.8125rem] text-ink-3">
        <MessageBubble className="shrink-0 text-[1rem]" />
        알림은 휴대폰 알림으로 올리게 되요!
      </div>

      {mutation.isError && (
        <p className="mt-3 text-[0.8125rem] text-terra">
          저장하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
          취소
        </Button>
        <Button size="sm" loading={mutation.isPending} onClick={handleSave}>
          저장하기
        </Button>
      </div>
    </div>
  );
}

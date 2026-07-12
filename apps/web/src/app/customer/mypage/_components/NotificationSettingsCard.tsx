"use client";

import { useNotificationSettings } from "@/shared/api/use-notification-settings";
import { useUpdateNotificationSettings } from "@/shared/api/use-update-notification-settings";
import type {
  NotificationSettings,
  UpdateNotificationSettingsBody,
} from "@/shared/model/notification-settings.schema";
import { Toggle } from "@/shared/ui/Toggle";

type ToggleField = Extract<keyof NotificationSettings, "receivedProposal" | "kakaoPlusFriend">;

const TOGGLE_ROWS: { field: ToggleField; label: string }[] = [
  { field: "receivedProposal", label: "받은 제안 알림" },
  { field: "kakaoPlusFriend", label: "카카오톡 플러스 친구 알림" },
];

/** PC 알림 설정 카드 — 토글 2종(즉시 저장). 실패 시 서버 재검증으로 롤백. */
export function NotificationSettingsCard() {
  const { data: settings } = useNotificationSettings();
  const { mutate, isPending } = useUpdateNotificationSettings();

  return (
    <section className="rounded-card border border-line bg-card p-6 shadow-[0_1px_1px_rgba(21,32,46,0.03)]">
      <h2 className="text-[1.0625rem] font-bold text-ink">알림 설정</h2>

      <ul className="mt-2">
        {TOGGLE_ROWS.map((row, index) => (
          <li
            key={row.field}
            className={index > 0 ? "border-t border-line-2" : ""}
          >
            <Toggle
              className="w-full justify-between py-3.5 text-[0.875rem] font-bold text-ink-2"
              label={row.label}
              checked={settings?.[row.field] ?? false}
              disabled={!settings || isPending}
              onChange={(checked) =>
                mutate({ [row.field]: checked } as UpdateNotificationSettingsBody)
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

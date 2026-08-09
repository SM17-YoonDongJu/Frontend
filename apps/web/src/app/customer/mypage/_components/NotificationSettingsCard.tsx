"use client";

import type { Ref } from "react";
import { useNotificationSettings } from "@/shared/api/use-notification-settings";
import { useUpdateNotificationSettings } from "@/shared/api/use-update-notification-settings";
import type {
  NotificationSettings,
  UpdateNotificationSettingsBody,
} from "@/shared/model/notification-settings.schema";
import { Toggle } from "@/shared/ui/Toggle";
import { toast } from "@/shared/ui/toast";

type ToggleField = Extract<keyof NotificationSettings, "receivedProposal" | "kakaoPlusFriend">;

const TOGGLE_ROWS: { field: ToggleField; label: string }[] = [
  { field: "receivedProposal", label: "받은 제안 알림" },
  { field: "kakaoPlusFriend", label: "카카오톡 플러스 친구 알림" },
];

interface NotificationSettingsCardProps {
  /** 알림 팝오버에서 진입할 때 스크롤·포커스 대상으로 쓰인다. */
  ref?: Ref<HTMLElement>;
}

/** PC 알림 설정 카드 — 토글 2종(즉시 저장). 실패 시 서버 재검증으로 롤백. */
export function NotificationSettingsCard({ ref }: NotificationSettingsCardProps) {
  const { data: settings } = useNotificationSettings();
  const { mutate, isPending } = useUpdateNotificationSettings();

  return (
    <section
      ref={ref}
      tabIndex={-1}
      className="rounded-card border border-line bg-card p-6 shadow-[0_1px_1px_rgba(21,32,46,0.03)] outline-none focus-visible:ring-[3px] focus-visible:ring-gold-soft"
    >
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
                mutate({ [row.field]: checked } as UpdateNotificationSettingsBody, {
                  onError: () =>
                    toast.error(
                      "알림 설정 저장에 실패했어요. 잠시 후 다시 시도해 주세요.",
                    ),
                })
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

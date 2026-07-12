import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { notificationSettingsSchema } from "@/shared/model/notification-settings.schema";
import type {
  NotificationSettings,
  UpdateNotificationSettingsBody,
} from "@/shared/model/notification-settings.schema";

export function updateNotificationSettings(
  body: UpdateNotificationSettingsBody,
): Promise<NotificationSettings> {
  return fetchJson(
    `${API_BASE_URL}/users/me/notification-settings`,
    notificationSettingsSchema,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

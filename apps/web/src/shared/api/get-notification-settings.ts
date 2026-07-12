import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { notificationSettingsSchema } from "@/shared/model/notification-settings.schema";
import type { NotificationSettings } from "@/shared/model/notification-settings.schema";

export function getNotificationSettings(): Promise<NotificationSettings> {
  return fetchJson(
    `${API_BASE_URL}/users/me/notification-settings`,
    notificationSettingsSchema,
  );
}

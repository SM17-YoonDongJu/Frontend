import "@/shared/api/client";
import { getMySettings } from "@/shared/api/generated/sdk.gen";
import { notificationSettingsSchema } from "@/shared/model/notification-settings.schema";
import type { NotificationSettings } from "@/shared/model/notification-settings.schema";

export async function getNotificationSettings(): Promise<NotificationSettings> {
  const { data } = await getMySettings({
    throwOnError: true,
  });
  return notificationSettingsSchema.parse(data);
}

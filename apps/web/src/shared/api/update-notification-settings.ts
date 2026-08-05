import "@/shared/api/client";
import { updateMySettings } from "@/shared/api/generated/sdk.gen";
import { notificationSettingsSchema } from "@/shared/model/notification-settings.schema";
import type {
  NotificationSettings,
  UpdateNotificationSettingsBody,
} from "@/shared/model/notification-settings.schema";

export async function updateNotificationSettings(
  body: UpdateNotificationSettingsBody,
): Promise<NotificationSettings> {
  const { data } = await updateMySettings({
    throwOnError: true,
    body,
  });
  return notificationSettingsSchema.parse(data);
}

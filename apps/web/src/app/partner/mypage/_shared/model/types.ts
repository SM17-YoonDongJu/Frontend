import type { z } from "zod";
import type {
  notificationSettingsSchema,
  updateNotificationSettingsBodySchema,
} from "./notification-settings.schema";

export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type UpdateNotificationSettingsBody = z.infer<
  typeof updateNotificationSettingsBodySchema
>;

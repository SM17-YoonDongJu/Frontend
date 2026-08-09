import "@/shared/api/client";
import { getMyNotifications } from "@/shared/api/generated/sdk.gen";
import {
  notificationListSchema,
  type NotificationList,
} from "../model/notification.schema";

export async function getNotificationList(): Promise<NotificationList> {
  const { data } = await getMyNotifications({
    throwOnError: true,
  });
  return notificationListSchema.parse(data);
}

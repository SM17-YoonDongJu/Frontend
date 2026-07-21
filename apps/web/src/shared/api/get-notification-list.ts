import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import {
  notificationListSchema,
  type NotificationList,
} from "../model/notification.schema";

export function getNotificationList(): Promise<NotificationList> {
  return fetchJson(
    `${API_BASE_URL}/users/me/notifications`,
    notificationListSchema,
  );
}

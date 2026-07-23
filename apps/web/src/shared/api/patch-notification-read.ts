import { z } from "zod";
import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";

// 개별 알림 읽음 처리(#162, 스웨거 확정). body 없음, 성공 응답 data는 null.
const readResultSchema = z.null();

export function patchNotificationRead(notificationId: string) {
  return fetchJson(
    `${API_BASE_URL}/users/me/notifications/${notificationId}/read`,
    readResultSchema,
    { method: "PATCH" },
  );
}

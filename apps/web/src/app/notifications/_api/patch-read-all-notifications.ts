// CONTRACT: 명세없음-초안(.pr-assets/api-spec-draft-notifications.md)
import { z } from "zod";
import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";

// 모두 읽음 처리. body 없음, 성공 응답 data는 null.
const readAllResultSchema = z.null();

export function patchReadAllNotifications() {
  return fetchJson(
    `${API_BASE_URL}/users/me/notifications/read-all`,
    readAllResultSchema,
    { method: "PATCH" },
  );
}

import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { meSchema } from "@/shared/model/user";
import type { Me, UpdateMeBody } from "@/shared/model/user";

// CONTRACT(명세없음-확장, 이슈 #105): PATCH /users/me에 phone·avatarUrl 확장.
export function updateMe(body: UpdateMeBody): Promise<Me> {
  return fetchJson(`${API_BASE_URL}/users/me`, meSchema, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

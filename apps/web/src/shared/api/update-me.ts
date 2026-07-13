import { z } from "zod";
import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { UpdateMeBody } from "@/shared/model/user";

// CONTRACT(이슈 #105): PATCH /users/me 응답은 부분 필드(userId·nickname·email)이며 userId가 number다
// — GET /users/me는 uuid string. meSchema로 파싱 불가하고 캐시에 쓰면 role·createdAt·phone이 소실된다.
// → 응답을 신뢰하지 않고 폐기한다. 갱신은 use-update-me의 user.me invalidate(GET 재조회)로만 반영.
export async function updateMe(body: UpdateMeBody): Promise<void> {
  await fetchJson(`${API_BASE_URL}/users/me`, z.unknown(), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

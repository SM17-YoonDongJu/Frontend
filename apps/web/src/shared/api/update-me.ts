import { z } from "zod";
import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { UpdateMeBody } from "@/shared/model/user";

// PATCH /users/me 응답은 GET와 동일한 me 전체 객체(명세 2026-07-14). 캐시는 단일 소스로 유지하기 위해
// 응답을 쓰지 않고 폐기하고, 갱신은 use-update-me의 user.me invalidate(GET 재조회)로만 반영한다.
export async function updateMe(body: UpdateMeBody): Promise<void> {
  await fetchJson(`${API_BASE_URL}/users/me`, z.unknown(), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

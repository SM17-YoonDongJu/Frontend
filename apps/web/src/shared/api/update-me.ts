import "@/shared/api/client";
import { updateMe as updateMeRequest } from "@/shared/api/generated/sdk.gen";
import type { UpdateMeBody } from "@/shared/model/user";

// PATCH /users/me 응답은 GET와 동일한 me 전체 객체(명세 2026-07-14). 캐시는 단일 소스로 유지하기 위해
// 응답을 쓰지 않고 폐기하고, 갱신은 use-update-me의 user.me invalidate(GET 재조회)로만 반영한다.
export async function updateMe(body: UpdateMeBody): Promise<void> {
  await updateMeRequest({
    throwOnError: true,
    body,
  });
}

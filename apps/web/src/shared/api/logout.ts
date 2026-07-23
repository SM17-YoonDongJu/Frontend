import { z } from "zod";
import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";

const logoutSchema = z.null().nullish();

/**
 * 세션 종료 — refresh_token HttpOnly 쿠키 기반이라 요청 바디 없음, 응답 data는 null.
 * 이미 만료된 세션의 401도 호출부가 정리만 하면 되므로 재발급·로그인 안내 이동을 타지 않는다.
 */
export async function logout(): Promise<void> {
  await fetchJson(`${API_BASE_URL}/auth/logout`, logoutSchema, {
    method: "POST",
    skipTokenReissue: true,
    skipAuthRedirect: true,
  });
}

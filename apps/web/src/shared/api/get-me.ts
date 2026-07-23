import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { meSchema } from "@/shared/model/user";
import type { Me } from "@/shared/model/user";

export function getMe(): Promise<Me> {
  // 인증 상태 프로브 — 401을 useAuthStatus가 "비로그인"으로 해석하므로 로그인 안내 이동을 타지 않는다.
  return fetchJson(`${API_BASE_URL}/users/me`, meSchema, {
    skipAuthRedirect: true,
  });
}

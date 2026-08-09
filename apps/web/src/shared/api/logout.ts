import "@/shared/api/client";
import { logout as logoutRequest } from "@/shared/api/generated/sdk.gen";

/**
 * 세션 종료 — refresh_token HttpOnly 쿠키 기반이라 요청 바디 없음.
 * 이미 만료된 세션의 401도 호출부가 정리만 하면 되므로 재발급·로그인 안내 이동을 타지 않는다.
 */
export async function logout(): Promise<void> {
  await logoutRequest({
    throwOnError: true,
    meta: { skipTokenReissue: true, skipAuthRedirect: true },
  });
}

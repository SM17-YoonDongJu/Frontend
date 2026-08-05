import "@/shared/api/client";
import { withdraw as withdrawRequest } from "@/shared/api/generated/sdk.gen";
import { ERROR_CODES, getErrorCode } from "@/shared/api/error-codes";

/**
 * 회원 탈퇴 — 인증은 HttpOnly 쿠키 기반이라 요청 바디 없음, 응답 data는 null.
 * 실패 시 페이지가 에러를 안내하고 재시도해야 하므로 로그인 안내 이동을 타지 않는다.
 * 404 USER_NOT_FOUND는 이미 탈퇴된 계정이라 재시도할 게 없다 — 성공으로 간주한다.
 */
export async function withdraw(): Promise<void> {
  try {
    await withdrawRequest({
      throwOnError: true,
      meta: { skipAuthRedirect: true },
    });
  } catch (error) {
    if (getErrorCode(error) !== ERROR_CODES.USER_NOT_FOUND) throw error;
  }
}

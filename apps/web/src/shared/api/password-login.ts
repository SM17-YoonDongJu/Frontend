import "@/shared/api/client";
import { login as loginRequest } from "@/shared/api/generated/sdk.gen";
import {
  passwordAuthResponseSchema,
  type PasswordAuthResponse,
  type PasswordLoginBody,
} from "@/shared/model/password-auth";

/**
 * POST /auth/password/login(200) — 응답 래퍼 해제 + 응답 zod 검증.
 * 아이디 대소문자는 백엔드가 소문자로 정규화하므로 FE에서 손대지 않는다.
 * meta 미전달 이유는 password-signup.ts와 같다.
 */
export async function passwordLogin(body: PasswordLoginBody): Promise<PasswordAuthResponse> {
  const { data } = await loginRequest({
    throwOnError: true,
    body: {
      login_id: body.loginId,
      password: body.password,
    },
  });
  return passwordAuthResponseSchema.parse(data);
}

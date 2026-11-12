import "@/shared/api/client";
import { signup as signupRequest } from "@/shared/api/generated/sdk.gen";
import {
  passwordAuthResponseSchema,
  type PasswordAuthResponse,
  type PasswordSignupBody,
} from "@/shared/model/password-auth";

/**
 * POST /auth/password/signup(201) — 응답 래퍼 해제 + 응답 zod 검증.
 * 성공 응답의 Set-Cookie로 소셜과 같은 세션이 서므로 로그인을 다시 호출하지 않는다.
 *
 * meta를 넘기지 않는 건 의도다 — meta는 커스텀 헤더로 전달되고 백엔드 CORS 허용 헤더가
 * Content-Type 하나뿐이라, base URL을 백엔드에 직접 꽂은 배포에서 preflight가 막힌다.
 * 넘길 필요도 없다: 이 경로의 401은 EXPIRED_TOKEN이 아니라 재발급을 타지 않고,
 * LOGIN_FAILED를 AUTH_REDIRECT_CODES에 넣지 않아 /login-required로도 튕기지 않는다.
 */
export async function passwordSignup(body: PasswordSignupBody): Promise<PasswordAuthResponse> {
  const { data } = await signupRequest({
    throwOnError: true,
    body: {
      login_id: body.loginId,
      password: body.password,
      name: body.name,
    },
  });
  return passwordAuthResponseSchema.parse(data);
}

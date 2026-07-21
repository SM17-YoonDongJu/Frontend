import { z } from "zod";
import { userTypeSchema } from "@/shared/model/user";

// POST /auth/register 요청 body — 현행 가입 폼이 수집하는 필드만 전송(사용자 확정 2026-07-21). 이메일 미수집.
// CONTRACT: 명세(2026-07-09 개정)는 birth_date·phone_number·gender까지 필수 7필드 — 폼 미수집으로 미전송,
// 백엔드에 선택 완화/제거 확인 필요.
// 약관 동의(이용약관/개인정보/마케팅)는 프론트 게이트 전용이며 body 미제출(#43 확정).
export const registerBodySchema = z.object({
  provider: z.enum(["kakao", "naver"]),
  socialToken: z.string(),
  nickname: z.string().min(1).max(30),
  userType: userTypeSchema,
});

// register 응답 역할 필드. 요청 body의 `userType`(insured_person/adjuster)와 이름·값이 다름 —
// 응답은 Notion 명세대로 `role`(USER/UNCERTIFICATED_ADJUSTER). 매핑: insured_person→USER, adjuster→UNCERTIFICATED_ADJUSTER.
export const registerRoleSchema = z.enum(["USER", "UNCERTIFICATED_ADJUSTER"]);

// POST /auth/register 응답 data(201). 토큰은 HttpOnly 쿠키(Set-Cookie access_token 30분/refresh_token 14일) —
// 응답 body엔 accessToken/refreshToken 없음. data = { userId(uuid), nickname, role }.
export const registerResponseSchema = z.object({
  userId: z.string(),
  nickname: z.string(),
  role: registerRoleSchema,
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type RegisterRole = z.infer<typeof registerRoleSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// UI 로컬 퍼널 상태(선택역할·닉네임·소셜값) → 명세 body 매핑.
// 약관 동의는 프론트 게이트 전용이므로 여기서 제외된다.
export interface SignupDraft {
  provider: RegisterBody["provider"];
  socialToken: string;
  userType: RegisterBody["userType"];
  nickname: string;
}

export function toRegisterBody(draft: SignupDraft): RegisterBody {
  return registerBodySchema.parse({
    provider: draft.provider,
    socialToken: draft.socialToken,
    nickname: draft.nickname,
    userType: draft.userType,
  });
}

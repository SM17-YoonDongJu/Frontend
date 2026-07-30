import { z } from "zod";
import { userTypeSchema } from "@/shared/model/user";

// register 성별 값 — 명세(2026-07-09 개정) M/F.
export const genderSchema = z.enum(["M", "F"]);

// POST /auth/register 요청 body — 명세(2026-07-09 개정) 필수 필드 반영(#173).
// gender·birthDate·phoneNumber는 본인 확인 스텝에서 수집(dev 백엔드 실측으로 필수 확정).
// Figma의 이름·지역은 명세에 없어 미전송(백엔드 수용 확정 시 추가) — 드래프트에만 보관. 이메일 미수집.
// 약관 동의(이용약관/개인정보/마케팅)는 프론트 게이트 전용이며 body 미제출(#43 확정).
export const registerBodySchema = z.object({
  provider: z.enum(["kakao", "naver", "apple"]),
  socialToken: z.string(),
  nickname: z.string().min(1).max(30),
  userType: userTypeSchema,
  gender: genderSchema,
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  phoneNumber: z.string().regex(/^01\d-\d{3,4}-\d{4}$/),
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

export type Gender = z.infer<typeof genderSchema>;
export type RegisterBody = z.infer<typeof registerBodySchema>;
export type RegisterRole = z.infer<typeof registerRoleSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// UI 로컬 퍼널 상태(선택역할·닉네임·소셜값·본인 확인 입력) → 명세 body 매핑.
// 약관 동의는 프론트 게이트 전용이므로 여기서 제외된다.
export interface SignupDraft {
  provider: RegisterBody["provider"];
  socialToken: string;
  userType: RegisterBody["userType"];
  nickname: string;
  gender: Gender;
  birthDate: string;
  phoneNumber: string;
}

export function toRegisterBody(draft: SignupDraft): RegisterBody {
  return registerBodySchema.parse({
    provider: draft.provider,
    socialToken: draft.socialToken,
    nickname: draft.nickname,
    userType: draft.userType,
    gender: draft.gender,
    birthDate: draft.birthDate,
    phoneNumber: draft.phoneNumber,
  });
}

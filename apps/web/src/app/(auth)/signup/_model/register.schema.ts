import { z } from "zod";
import { userTypeSchema } from "@/shared/model/user";

// POST /auth/register 요청 body — Notion 명세 5필드가 단일 진실.
// 약관 동의(이용약관/개인정보/마케팅)는 프론트 게이트 전용이며 body 미제출(#43 확정).
export const registerBodySchema = z.object({
  provider: z.enum(["kakao", "naver"]),
  socialToken: z.string(),
  nickname: z.string().min(2).max(20),
  userType: userTypeSchema,
  email: z.string().email().optional(),
});

// register 응답 역할 필드. 요청 body의 `userType`(insured_person/adjuster)와 이름·값이 다름 —
// 응답은 Notion 명세대로 `role`(USER/UNCERTIFICATED_ADJUSTER). 매핑: insured_person→USER, adjuster→UNCERTIFICATED_ADJUSTER.
export const registerRoleSchema = z.enum(["USER", "UNCERTIFICATED_ADJUSTER"]);

// POST /auth/register 응답 data. userId는 전역 uuid(string, §7-2 해소 #43).
export const registerResponseSchema = z.object({
  userId: z.string(),
  nickname: z.string(),
  role: registerRoleSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
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
  email?: string;
}

export function toRegisterBody(draft: SignupDraft): RegisterBody {
  return registerBodySchema.parse({
    provider: draft.provider,
    socialToken: draft.socialToken,
    nickname: draft.nickname,
    userType: draft.userType,
    email: draft.email,
  });
}

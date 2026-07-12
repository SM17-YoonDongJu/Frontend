import { z } from "zod";
import { userRoleSchema } from "./user-role";

// CONTRACT(naming-dictionary §7-4): GET /users/me 예시에 userType 한글 혼합·검증여부 혼재.
// FE는 영문 enum 기준. 검증여부 필드는 고객 대시보드 미사용.
export const userTypeSchema = z.enum(["insured_person", "adjuster"]);

// 소셜 연결 — auth §4 provider 값 재사용.
export const socialProviderSchema = z.enum(["kakao", "naver"]);

// CONTRACT(명세없음-확장, 이슈 #105): 고객 마이페이지가 요구하는 phone·avatarUrl·role·socialProvider를
// GET /users/me에 확장(초안 .pr-assets/api-spec-draft-user-mypage.md). 백엔드 미확정 — MSW 선반영.
export const meSchema = z.object({
  userId: z.string(), // §7-2 해소(#43, 2026-07-05): 전역 uuid(string) 통일.
  nickname: z.string(),
  email: z.string().nullable(),
  userType: userTypeSchema,
  createdAt: z.string(),
  phone: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  role: userRoleSchema.nullable(),
  socialProvider: socialProviderSchema.nullable(),
});

// PATCH /users/me 부분 수정 — 마이페이지는 phone·avatarUrl만, 기존 nickname·email 유지.
export const updateMeBodySchema = z
  .object({
    nickname: z.string(),
    email: z.string(),
    phone: z.string(),
    avatarUrl: z.string(),
  })
  .partial();

export type UserType = z.infer<typeof userTypeSchema>;
export type SocialProvider = z.infer<typeof socialProviderSchema>;
export type Me = z.infer<typeof meSchema>;
export type UpdateMeBody = z.infer<typeof updateMeBodySchema>;

import { z } from "zod";
import { userRoleSchema } from "./user-role";
import { UserUpdateRequestSchema } from "@/shared/api/generated/zod.gen";
import type { UserMeResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

// CONTRACT(naming-dictionary §7-4): GET /users/me 예시에 userType 한글 혼합·검증여부 혼재.
// FE는 영문 enum 기준. 검증여부 필드는 고객 대시보드 미사용.
export const userTypeSchema = z.enum(["insured_person", "adjuster"]);

// 소셜 연결 — auth §4 provider 값 재사용.
export const socialProviderSchema = z.enum(["kakao", "naver", "apple"]);

// 성별 — GET /users/me·POST /auth/register 공용(M/F/UNKNOWN).
export const genderSchema = z.enum(["M", "F", "UNKNOWN"]);

// GET /users/me 확정 응답(Notion 명세, 2026-07-14): user_id·nickname·phone_number·role·gender·region[]·avatar_url·created_at.
// - phoneNumber(사전 phone_number)·region(배열)·avatarUrl·gender는 명세 확정 필드(더 이상 미채택 확장 아님).
// - region은 문자열 배열(활동/거주 복수). userType은 응답에 없어 role에서 파생(USER=피보험자, 그 외=사정사).
// - CONTRACT(명세없음-확장): email·socialProvider는 명세 GET 응답에 없다. FE가 최근 로그인 마스킹·가입경로 표시에 쓰므로
//   nullish 확장으로 유지(실서버 키 부재 시 null). 키가 없어도 파싱되도록 nullish → null 정규화.
export const meSchema = z
  .object({
    userId: z.string(), // §7-2 해소(#43, 2026-07-05): 전역 uuid(string) 통일.
    nickname: z.string(),
    createdAt: z.string(),
    role: userRoleSchema,
    phoneNumber: z.string().nullish(),
    gender: genderSchema.nullish(),
    region: z.array(z.string()).nullish(), // 활동/거주 지역(복수) — 명세 배열.
    avatarUrl: z.string().nullish(),
    userType: userTypeSchema.optional(),
    email: z.string().nullish(),
    socialProvider: socialProviderSchema.nullish(),
  })
  .transform((me) => ({
    ...me,
    email: me.email ?? null,
    userType: me.userType ?? deriveUserType(me.role),
    phoneNumber: me.phoneNumber ?? null,
    gender: me.gender ?? null,
    avatarUrl: me.avatarUrl ?? null,
    socialProvider: me.socialProvider ?? null,
    region: me.region ?? [],
  }));

/** role → userType 파생. 응답에 userType이 없어 FE가 계산한다(ADMIN은 고객 화면 비대상 → 피보험자 취급). */
function deriveUserType(role: z.infer<typeof userRoleSchema>): UserType {
  return role === "CERTIFICATED_ADJUSTER" || role === "UNCERTIFICATED_ADJUSTER"
    ? "adjuster"
    : "insured_person";
}

// PATCH /users/me 확정 body(Notion 명세, 하나 이상 포함): phone_number·region[]·avatar_url.
// 생성 스키마 그대로 사용 — 필드 3개 다 선택이고 우리가 따로 추가한 제약이 없어 그대로 상속.
export const updateMeBodySchema = UserUpdateRequestSchema;

export type UserType = z.infer<typeof userTypeSchema>;
export type SocialProvider = z.infer<typeof socialProviderSchema>;
export type Gender = z.infer<typeof genderSchema>;
export type Me = z.infer<typeof meSchema>;
export type UpdateMeBody = z.infer<typeof updateMeBodySchema>;

// userType(FE 파생)·email(명세 GET 응답에 없는 FE 전용 확장)은 대조 대상에서 제외.
type _MeDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<Me, "userType" | "email">, UserMeResponse>
>;

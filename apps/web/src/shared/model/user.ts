import { z } from "zod";
import { userRoleSchema } from "./user-role";

// CONTRACT(naming-dictionary §7-4): GET /users/me 예시에 userType 한글 혼합·검증여부 혼재.
// FE는 영문 enum 기준. 검증여부 필드는 고객 대시보드 미사용.
export const userTypeSchema = z.enum(["insured_person", "adjuster"]);

// 소셜 연결 — auth §4 provider 값 재사용.
export const socialProviderSchema = z.enum(["kakao", "naver"]);

// 실제 GET /users/me 응답은 userId·nickname·email·role·createdAt 5필드만 준다(백엔드 확인, 2026-07-13).
// - userType은 응답에 없다 → role에서 파생(USER=피보험자, 그 외=사정사). 소비처(탭바·랜딩 리다이렉트·리포트 상세)는 기존대로 userType 사용.
// - phone·avatarUrl·socialProvider·region은 마이페이지(#105)가 요구하는 확장 필드로 아직 백엔드에 없다
//   (초안 .pr-assets/api-spec-draft-user-mypage.md). 키가 없어도 파싱되도록 nullish → null 정규화.
//   필수(.nullable())로 두면 키 부재 시 파싱이 깨져 화면이 무한 로딩된다.
export const meSchema = z
  .object({
    userId: z.string(), // §7-2 해소(#43, 2026-07-05): 전역 uuid(string) 통일.
    nickname: z.string(),
    email: z.string().nullish(),
    createdAt: z.string(),
    role: userRoleSchema,
    userType: userTypeSchema.optional(),
    phone: z.string().nullish(),
    avatarUrl: z.string().nullish(),
    socialProvider: socialProviderSchema.nullish(),
    region: z.string().nullish(), // 활동/거주 지역 — 사전 §3 adjuster-applications `region` 재사용.
  })
  .transform((me) => ({
    ...me,
    email: me.email ?? null,
    userType: me.userType ?? deriveUserType(me.role),
    phone: me.phone ?? null,
    avatarUrl: me.avatarUrl ?? null,
    socialProvider: me.socialProvider ?? null,
    region: me.region ?? null,
  }));

/** role → userType 파생. 응답에 userType이 없어 FE가 계산한다(ADMIN은 고객 화면 비대상 → 피보험자 취급). */
function deriveUserType(role: z.infer<typeof userRoleSchema>): UserType {
  return role === "CERTIFICATED_ADJUSTER" || role === "UNCERTIFICATED_ADJUSTER"
    ? "adjuster"
    : "insured_person";
}

// PATCH /users/me 부분 수정 — 마이페이지는 phone·avatarUrl·region, 기존 nickname·email 유지.
export const updateMeBodySchema = z
  .object({
    nickname: z.string(),
    email: z.string(),
    phone: z.string(),
    avatarUrl: z.string(),
    region: z.string(),
  })
  .partial();

export type UserType = z.infer<typeof userTypeSchema>;
export type SocialProvider = z.infer<typeof socialProviderSchema>;
export type Me = z.infer<typeof meSchema>;
export type UpdateMeBody = z.infer<typeof updateMeBodySchema>;

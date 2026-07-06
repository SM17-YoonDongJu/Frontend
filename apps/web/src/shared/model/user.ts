import { z } from "zod";

// CONTRACT(naming-dictionary §7-4): GET /users/me 예시에 userType 한글 혼합·검증여부 혼재.
// FE는 영문 enum 기준. 검증여부 필드는 고객 대시보드 미사용.
export const userTypeSchema = z.enum(["insured_person", "adjuster"]);

export const meSchema = z.object({
  userId: z.string(), // §7-2 해소(#43, 2026-07-05): 전역 uuid(string) 통일.
  nickname: z.string(),
  email: z.string().nullable(),
  userType: userTypeSchema,
  createdAt: z.string(),
});

export type UserType = z.infer<typeof userTypeSchema>;
export type Me = z.infer<typeof meSchema>;

import { z } from "zod";
import type { AdjusterProfileResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

// 실응답은 미작성 프로필에서 기간·회사가 null로 올 수 있음(폼 검증용 careerItemSchema는 편집 세그먼트가 소유).
export const careerItemResponseSchema = z.object({
  period: z.string().nullable(),
  company: z.string().nullable(),
});

/**
 * 손해사정사 본인 프로필 — GET /adjusters/me/profile.
 * 편집 화면(입력 필드)과 홈 헤더·인사말(집계 필드)이 같은 응답을 공유한다.
 */
export const adjusterProfileSchema = z.object({
  adjusterId: z.string().uuid(),
  nickname: z.string(),
  headline: z.string().nullable(),
  introduction: z.string().nullable(),
  career: z.number().int().nonnegative().nullable(),
  activityRegion: z.string(),
  avatarUrl: z.string().url().nullable(),
  specialties: z.array(z.string()),
  careers: z.array(careerItemResponseSchema),
  // 실 API 미정 필드(MSW 선제공) — 명세 확정 시 필수로 승격
  registrationNo: z.string().nullish(),
  updatedAt: z.string().nullable(),
  // 홈 헤더·인사말용 집계(읽기 전용)
  averageRating: z.number(),
  reviewCount: z.number().int(),
  pendingReviewCount: z.number().int(),
});

export type AdjusterProfile = z.infer<typeof adjusterProfileSchema>;
export type CareerItemResponse = z.infer<typeof careerItemResponseSchema>;

// registrationNo는 실 API 미정 필드(MSW 선제공) — 대조 대상에서 제외.
type _AdjusterProfileDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<AdjusterProfile, "registrationNo">, AdjusterProfileResponse>
>;

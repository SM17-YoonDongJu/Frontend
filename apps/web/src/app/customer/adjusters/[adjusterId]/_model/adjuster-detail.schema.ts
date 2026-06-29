import { z } from "zod";

/** 손해사정사 공개 프로필. 출처: API 명세 GET /adjusters/{adjusterId}. 필드명 명세 그대로. */

export const adjusterCareerSchema = z.object({
  period: z.string(),
  company: z.string(),
});

export const adjusterReviewSchema = z.object({
  nickname: z.string(),
  score: z.number(),
  item: z.string(),
  reviewedAt: z.string(),
  content: z.string(),
});

/** 상담 안내 — 실 API 미정 필드(MSW 선제공). 추후 명세 확정 시 교체. */
export const consultGuideSchema = z.object({
  method: z.string(),
  initialConsult: z.string(),
  feeBasis: z.string(),
});

/** 인증 정보 — registrationNo·verifiedAt은 실 API 미정 필드(MSW 선제공). */
export const certificationSchema = z.object({
  registrationNo: z.string(),
  verifiedAt: z.string().nullable(),
});

export const adjusterDetailSchema = z.object({
  adjusterId: z.uuid(),
  nickname: z.string(),
  avatarUrl: z.string().nullable(),
  headline: z.string(),
  activityRegion: z.string(),
  introduction: z.string(),
  specialties: z.array(z.string()),
  careers: z.array(adjusterCareerSchema),
  career: z.number().int(),
  averageRating: z.number(),
  reviewCount: z.number().int(),
  recentReviews: z.array(adjusterReviewSchema),
  completedConsultCount: z.number().int(),
  handledCaseCount: z.number().int(),
  verified: z.boolean(),
  consultGuide: consultGuideSchema,
  certification: certificationSchema,
});

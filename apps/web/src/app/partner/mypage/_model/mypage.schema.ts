import { z } from "zod";

/** 손해사정사 마이페이지 집계 — GET /adjusters/me/mypage (명세 등록 2026-07-05) */

// userRoleSchema는 src/shared/model로 승격(이슈 #105) — 여기선 import 후 재노출.
import { userRoleSchema } from "@/shared/model/user-role";
export { userRoleSchema };

export const mypageProfileSchema = z.object({
  nickname: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),
  headline: z.string(),
  specialties: z.array(z.string()),
  career: z.number().int(),
  activityRegion: z.string(),
  role: userRoleSchema,
});

export const mypageStatsSchema = z.object({
  averageRating: z.number().nullable(),
  reviewCount: z.number().int(),
  totalCompletedCount: z.number().int(),
  consultationConversionRate: z.number().int().min(0).max(100).nullable(),
});

export const mypageMonthlyActivitySchema = z.object({
  completedCount: z.number().int(),
  consultationConvertedCount: z.number().int(),
  averageRating: z.number().nullable(),
});

export const mypageCertificationSchema = z.object({
  licenseNo: z.string(),
  activityRegion: z.string(),
  createdAt: z.string(),
});

export const mypageSchema = z.object({
  profile: mypageProfileSchema,
  stats: mypageStatsSchema,
  monthlyActivity: mypageMonthlyActivitySchema,
  certification: mypageCertificationSchema,
});

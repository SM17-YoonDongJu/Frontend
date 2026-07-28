import { z } from "zod";

/** 손해사정사 홈 대시보드 집계(BFF). 출처: GET /adjusters/me/home. */

export const homeAdjusterSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
});

export const homeRatingSchema = z.object({
  average: z.number().nullable(),
  reviewCount: z.number().int().nullable(),
});

export const homeSummarySchema = z.object({
  pendingCount: z.number().int(),
  pendingNewCount: z.number().int(),
  inProgressCount: z.number().int(),
  monthlyCompletedCount: z.number().int(),
  totalCompletedCount: z.number().int().nullable(),
  consultationConvertedCount: z.number().int().nullable(),
  rating: homeRatingSchema,
});

export const homeInProgressCaseSchema = z.object({
  reportId: z.uuid(),
  caseNo: z.string(),
  accidentType: z.string(),
  title: z.string(),
  reportStatus: z.string(),
  reviewStatus: z.string().nullable(),
  stageLabel: z.string(),
  progressPercent: z.number().int().min(0).max(100),
});

export const homeInProgressSchema = z.object({
  total: z.number().int(),
  items: z.array(homeInProgressCaseSchema),
});

export const adjusterHomeSchema = z.object({
  adjuster: homeAdjusterSchema,
  summary: homeSummarySchema,
  inProgressCases: homeInProgressSchema,
});

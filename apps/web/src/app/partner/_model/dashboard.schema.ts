import { z } from "zod";

/** 손해사정사 대시보드. ⚠️ API 명세 미정(드리프트) — 목업. 백엔드 신설 요청. */

export const dashboardSummarySchema = z.object({
  pendingCount: z.number().int(),
  pendingNewCount: z.number().int(),
  inProgressCount: z.number().int(),
  monthlyCompletedCount: z.number().int(),
  totalCompletedCount: z.number().int(),
  averageRating: z.number(),
  reviewCount: z.number().int(),
});

export const dashboardActivitySchema = z.object({
  completedCount: z.number().int(),
  consultConvertedCount: z.number().int(),
  averageRating: z.number(),
});

export const dashboardSchema = z.object({
  summary: dashboardSummarySchema,
  activity: dashboardActivitySchema,
});

export const inProgressStatusSchema = z.enum(["REVIEWING", "CUSTOMER_REVIEW"]);

export const inProgressCaseSchema = z.object({
  reportId: z.uuid(),
  accidentType: z.string(),
  caseId: z.string(),
  description: z.string(),
  status: inProgressStatusSchema,
  progress: z.number().int(),
});

export const inProgressListSchema = z.object({
  list: z.array(inProgressCaseSchema),
});

import { z } from "zod";
import type { AdjusterHomeResponse, Rating, Summary } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

/** 손해사정사 홈 대시보드 집계(BFF). 출처: GET /adjusters/me/home. */

export const homeAdjusterSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
});

// 백엔드 AdjusterHomeResponse.Summary/Rating 기준 — 전부 long/double 항상 present(평점은 미구현 시 0/0 placeholder).
export const homeRatingSchema = z.object({
  average: z.number(),
  reviewCount: z.number().int(),
});

export const homeSummarySchema = z.object({
  pendingCount: z.number().int(),
  pendingNewCount: z.number().int(),
  inProgressCount: z.number().int(),
  monthlyCompletedCount: z.number().int(),
  totalCompletedCount: z.number().int(),
  consultationConvertedCount: z.number().int(),
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

// adjuster는 명세 Adjuster 타입이 {nickname,career}뿐이라(다른 엔드포인트와 이름 재사용 추정) 제외.
// inProgressCases.items 원소도 범용 Item 스키마라 항목별 대조는 생략.
type _AdjusterHomeDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<z.infer<typeof adjusterHomeSchema>, "adjuster">, AdjusterHomeResponse>
>;
type _HomeSummaryDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof homeSummarySchema>, Summary>
>;
type _HomeRatingDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof homeRatingSchema>, Rating>
>;

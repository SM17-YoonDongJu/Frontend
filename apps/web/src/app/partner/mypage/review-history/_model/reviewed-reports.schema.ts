import { z } from "zod";
import { accidentTypeSchema } from "@/shared/model/accident-type";

/**
 * 사정사 검수 내역. 출처: API 명세 GET /adjusters/me/reviewed-reports.
 * 봉투(status/message/code)는 fetchJson이 해제 — 여기선 data 페이로드만 모델링.
 */

/** list[].status — 명세 Query status의 ALL(전체)을 제외한 실제 상태값. */
export const reviewStatusSchema = z.enum([
  "SENT",
  "CONSULTATION",
  "NOT_SELECTED",
  "CLOSED",
]);

export const reviewedReportItemSchema = z.object({
  caseId: z.string(),
  title: z.string(),
  sentDate: z.string(),
  status: reviewStatusSchema,
  statusLabel: z.string(),
  hasOpinion: z.boolean(),

  // ⚠️ 명세없음-1: list[]에 없음(Figma 카드 요구). FE optional + MSW 채움, 백엔드 list 확장 대기.
  accidentType: accidentTypeSchema.optional(),
  confirmedMinAmount: z.number().int().nullable().optional(),
  confirmedMaxAmount: z.number().int().nullable().optional(),
  rating: z.number().nullable().optional(),
});

export const reviewSummarySchema = z.object({
  monthlyReviewCount: z.number().int(),
  previousMonthReviewCount: z.number().int(),
  consultationConversionRate: z.number(),
  consultationConvertedCount: z.number().int(),
  totalCount: z.number().int(),
});

/** 서버 에코(data.filter) — 요청 필터 반영값. */
export const reviewFilterEchoSchema = z.object({
  status: z.string(),
  month: z.string(),
});

export const paginationSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  hasNext: z.boolean(),
});

/** = data 페이로드. */
export const reviewedReportsSchema = z.object({
  summary: reviewSummarySchema,
  filter: reviewFilterEchoSchema,
  list: z.array(reviewedReportItemSchema),
  pagination: paginationSchema,
});

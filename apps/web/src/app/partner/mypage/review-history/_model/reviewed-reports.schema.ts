import { z } from "zod";
import { accidentTypeSchema } from "@/shared/model/accident-type";
import type { ReviewedReportListResponse, Stats } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

/**
 * 사정사 검수 내역. 출처: API 명세 GET /adjusters/me/reviewed-reports.
 * 봉투(status/message/code)는 fetchJson이 해제 — 여기선 data 페이로드만 모델링.
 */

/** items[].status — 사정사 검수 상태(방향). 명세 Query status의 ALL(전체)은 제외. */
export const reviewStatusSchema = z.enum([
  "SENT",
  "COUNSELING",
  "REJECTED",
  "ACCEPTED",
]);

export const reviewedReportItemSchema = z.object({
  reportId: z.uuid(),
  caseNo: z.string(),
  title: z.string(),
  accidentType: accidentTypeSchema,
  region: z.string(),
  status: reviewStatusSchema,
  reviewedAt: z.string(),
});

export const reviewStatsSchema = z.object({
  monthlyReviewCount: z.number().int(),
  previousMonthReviewCount: z.number().int(),
  consultationConvertedCount: z.number().int(),
  // 0.0~1.0 비율(백분율 아님). 상담 전환 티켓 미구현으로 현재 항상 0.
  consultationConversionRate: z.number(),
  totalCount: z.number().int(),
});

/** = data 페이로드. 페이지 메타는 명세대로 data 최상위에 평면(page는 0부터). */
export const reviewedReportsSchema = z.object({
  stats: reviewStatsSchema,
  items: z.array(reviewedReportItemSchema),
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
});

// items 배열 원소는 명세가 범용 Item 스키마로 나와 있어 항목별 대조는 생략.
type _ReviewedReportsDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<z.infer<typeof reviewedReportsSchema>, "items">, ReviewedReportListResponse>
>;
type _ReviewStatsDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof reviewStatsSchema>, Stats>
>;

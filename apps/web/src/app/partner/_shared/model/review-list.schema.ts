import { z } from "zod";
import type { PendingReviewListResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";
import { enumWithFallback } from "@/shared/lib/enum-with-fallback";

/** 검수 대기 목록. 출처: API 명세 GET /reports/pending-review. 필드명 명세 그대로. */

export const reviewStatusSchema = enumWithFallback([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "CLOSED",
  // CONTRACT: 명세없음-임시 — 미채택 탭 대응값 백엔드 협의 중
  "NOT_SELECTED",
]);

export const reviewListItemSchema = z.object({
  reportId: z.uuid(),
  // 백엔드 PendingReviewListResponse.Item 기준(accidentType·status는 원본 null이면 null 그대로 노출).
  accidentType: z.string().nullable(),
  status: reviewStatusSchema.nullable(),
  createdAt: z.string(),
  caseId: z.string().nullish(),
  title: z.string().nullish(),
  region: z.string(),
  claimedMinAmount: z.number().int().nullish(),
  claimedMaxAmount: z.number().int().nullish(),
  // offerHeadroom(claimedMax - offered, 0 보정)은 항상 계산되어 내려오는 값 — null 아님.
  offerHeadroom: z.number().int(),
  issueCount: z.number().int(),
  held: z.boolean(),
});

export const paginationSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  hasNext: z.boolean(),
});

// CONTRACT: 명세없음-임시 — 탭 건수 필드 백엔드 협의 중
export const reviewStatusCountsSchema = z
  .object({ total: z.number().int() })
  .catchall(z.number().int());

export const reviewListSchema = z.object({
  list: z.array(reviewListItemSchema),
  pagination: paginationSchema,
  statusCounts: reviewStatusCountsSchema.optional(),
});

// statusCounts는 여전히 명세 미포함(백엔드 협의 중), list 원소는 범용 Item 스키마라 항목별 대조 생략.
type _ReviewListDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<z.infer<typeof reviewListSchema>, "list" | "statusCounts">, PendingReviewListResponse>
>;

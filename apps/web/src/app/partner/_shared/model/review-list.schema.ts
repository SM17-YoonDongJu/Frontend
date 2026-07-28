import { z } from "zod";

/** 검수 대기 목록. 출처: API 명세 GET /reports/pending-review. 필드명 명세 그대로. */

export const reviewStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "CLOSED",
  // CONTRACT: 명세없음-임시 — 미채택 탭 대응값 백엔드 협의 중
  "NOT_SELECTED",
]);

export const reviewListItemSchema = z.object({
  // 명세 확정 4필드 (naming-dictionary §7-6)
  reportId: z.uuid(),
  accidentType: z.string(),
  status: reviewStatusSchema,
  createdAt: z.string(),
  // CONTRACT: 명세없음-임시 — Figma 카드 요구 필드. list 미확장으로 FE optional + MSW 목킹.
  caseId: z.string().optional(),
  title: z.string().nullish(),
  region: z.string().optional(),
  claimedMinAmount: z.number().int().nullish(),
  claimedMaxAmount: z.number().int().nullish(),
  // CONTRACT: 명세없음-임시 — "제안 대비 +N만" 표시치. 백엔드 확장 시 정식 필드명 확인 대상.
  offerHeadroom: z.number().int().nullish(),
  // 명세 필드(issueCount·held) — PC 카드 쟁점 수·보류 표시용. list 미확장으로 FE optional.
  issueCount: z.number().int().optional(),
  held: z.boolean().optional(),
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

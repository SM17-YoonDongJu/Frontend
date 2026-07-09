import { z } from "zod";

/**
 * 받은 제안 목록. 출처: 식별자 사전 §5b GET /reports/{reportId}/proposals.
 * 제안 식별자는 proposalId(report_reviews.id) — 매칭/거절 PATCH 대상.
 */

// review status 원천(GET /reports/{id}/proposals): 발송(SENT) / 상담중(COUNSELING) / 거절(REJECTED) / 채택(ACCEPTED).
export const proposalStatusSchema = z.enum([
  "SENT",
  "COUNSELING",
  "REJECTED",
  "ACCEPTED",
]);

// 명세 필수: proposalId·adjusterId·nickname·rating·proposalSummary·status·submittedAt.
// 그 외(speciality·career·isNew·isVerified·estimate·feeBasis)는 디자인용 확장 → 백엔드 확정 전까지 optional.
export const proposalSchema = z.object({
  proposalId: z.uuid(), // report_reviews.id — 매칭/거절 PATCH 대상
  adjusterId: z.uuid(),
  nickname: z.string(),
  rating: z.number(),
  proposalSummary: z.string(),
  status: proposalStatusSchema,
  submittedAt: z.string(),
  speciality: z.string().optional(),
  career: z.number().int().optional(),
  isNew: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  estimateMinAmount: z.number().int().nullish(),
  estimateMaxAmount: z.number().int().nullish(),
  feeBasis: z.string().optional(),
});

// 분석 대상 요약(디자인용) — 명세 GET 응답에 없음 → 백엔드 확정 전까지 optional.
export const proposalTargetSchema = z.object({
  accidentType: z.string(),
  reportNo: z.string(),
  receivedAt: z.string(),
});

export const paginationSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  hasNext: z.boolean(),
});

export const proposalListSchema = z.object({
  target: proposalTargetSchema.optional(),
  list: z.array(proposalSchema),
  pagination: paginationSchema,
});

export type ProposalStatus = z.infer<typeof proposalStatusSchema>;
export type Proposal = z.infer<typeof proposalSchema>;
export type ProposalTarget = z.infer<typeof proposalTargetSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type ProposalList = z.infer<typeof proposalListSchema>;

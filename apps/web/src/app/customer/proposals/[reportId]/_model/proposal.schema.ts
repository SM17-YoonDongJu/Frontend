import { z } from "zod";

/**
 * 받은 제안 목록. 출처: 식별자 사전 §5b GET /reports/{reportId}/proposals.
 * 제안 식별자는 별도 proposalId 없이 adjusterId(reportId당 사정사 1제안).
 */

// CONTRACT: status enum 값은 COMPLETED만 확정. 다른 값 불명 → 확장 필요 시 추가.
export const proposalStatusSchema = z.enum(["COMPLETED"]);

// CONTRACT(목업 선구현): 아래 필드는 현 GET /reports/{reportId}/proposals 응답에 없음.
// 이미지 #18 풀 디자인용 — 백엔드 응답 확장 요청분(speciality·career·isNew·isVerified·estimate·feeBasis).
export const proposalSchema = z.object({
  adjusterId: z.uuid(),
  nickname: z.string(),
  rating: z.number(),
  proposalSummary: z.string(),
  status: proposalStatusSchema,
  submittedAt: z.string(),
  speciality: z.string(),
  career: z.number().int(),
  isNew: z.boolean(),
  isVerified: z.boolean(),
  estimateMinAmount: z.number().int().nullable(),
  estimateMaxAmount: z.number().int().nullable(),
  feeBasis: z.string(),
});

// CONTRACT(목업 선구현): 분석 대상 요약. reportNo(사람용 일련번호)·receivedAt(접수일)는
// 현 GET /reports/{reportId}에 없음 → 백엔드 추가 요청분.
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
  target: proposalTargetSchema,
  list: z.array(proposalSchema),
  pagination: paginationSchema,
});

export type ProposalStatus = z.infer<typeof proposalStatusSchema>;
export type Proposal = z.infer<typeof proposalSchema>;
export type ProposalTarget = z.infer<typeof proposalTargetSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type ProposalList = z.infer<typeof proposalListSchema>;

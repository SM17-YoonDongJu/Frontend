import { z } from "zod";

/**
 * 받은 제안 목록. 출처: 식별자 사전 §5b GET /reports/{reportId}/proposals.
 * 제안 식별자는 별도 proposalId 없이 adjusterId(reportId당 사정사 1제안).
 */

// CONTRACT: status enum 값은 COMPLETED만 확정. 다른 값 불명 → 확장 필요 시 추가.
export const proposalStatusSchema = z.enum(["COMPLETED"]);

export const proposalSchema = z.object({
  adjusterId: z.uuid(),
  nickname: z.string(),
  rating: z.number(),
  proposalSummary: z.string(),
  status: proposalStatusSchema,
  submittedAt: z.string(),
});

export const paginationSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  hasNext: z.boolean(),
});

export const proposalListSchema = z.object({
  list: z.array(proposalSchema),
  pagination: paginationSchema,
});

export type ProposalStatus = z.infer<typeof proposalStatusSchema>;
export type Proposal = z.infer<typeof proposalSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type ProposalList = z.infer<typeof proposalListSchema>;

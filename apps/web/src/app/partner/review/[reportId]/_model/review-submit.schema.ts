import { z } from "zod";
import { reviewIssueStatusSchema } from "./review-issue.schema";

// 검수 등록 시 쟁점별 검토 결과(REPORT_ISSUES) — 명세 5필드만 전송.
export const reviewSubmitIssueSchema = z.object({
  issueId: z.string(),
  reviewStatus: reviewIssueStatusSchema,
  adjusterOpinion: z.string().nullable(),
  modifiedReason: z.string().nullable(),
  excludedReason: z.string().nullable(),
});

// confirmedMin/MaxAmount는 명세 PATCH 바디에 없음(백엔드 확정 대기) — 현행 유지.
export const reviewSubmitSchema = z.object({
  applicableGuarantees: z.array(z.string()).optional(),
  omittedSpecialContract: z.array(z.string()).optional(),
  issues: z.array(reviewSubmitIssueSchema).optional(),
  review: z.string().optional(),
  confirmedMinAmount: z.number().int().nullable().optional(),
  confirmedMaxAmount: z.number().int().nullable().optional(),
  status: z.string().optional(),
});

export const reviewSubmitResultSchema = z.object({
  reportId: z.uuid(),
  status: z.string(),
});

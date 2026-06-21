import { z } from "zod";
import { reviewIssueSchema } from "./review-issue.schema";

// ⚠️ 명세 드리프트: 명세 issue는 string[], confirmedMin/MaxAmount는 명세 미존재. 리치 body는 MSW에서만 수용, 백엔드 계약 확장 협의 필요.
export const reviewSubmitSchema = z.object({
  applicableGuarantees: z.array(z.string()).optional(),
  omittedSpecialContract: z.array(z.string()).optional(),
  reviewIssues: z.array(reviewIssueSchema).optional(),
  review: z.string().optional(),
  confirmedMinAmount: z.number().int().nullable().optional(),
  confirmedMaxAmount: z.number().int().nullable().optional(),
  status: z.string().optional(),
});

export const reviewSubmitResultSchema = z.object({
  reportId: z.uuid(),
  status: z.string(),
});

import { z } from "zod";

export const reviewIssueStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "MODIFIED",
  "EXCLUDED",
]);

// ⚠️ 명세 드리프트: PATCH /reports/{id}의 issue는 string[]. 사진 기준 리치 모델은 MSW 전용, 백엔드 계약 확장 협의 필요.
export const reviewIssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  impactAmount: z.number().int().nullable(),
  status: reviewIssueStatusSchema,
  modifiedReason: z.string().nullable(),
  excludedReason: z.string().nullable(),
  adjusterOpinion: z.string().nullable(),
  tags: z.array(z.string()),
  isNew: z.boolean(),
});

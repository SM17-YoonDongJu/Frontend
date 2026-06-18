import { z } from "zod";

/** 리포트 상세. 출처: API 명세 GET /reports/{reportId}. 필드명 명세 그대로. */

export const reportStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "MATCHED",
]);

export const reportDetailSchema = z.object({
  reportId: z.uuid(),
  status: reportStatusSchema,
  accidentType: z.string(),
  treatment: z.string(),
  claimedMinAmount: z.number().int(),
  claimedMaxAmount: z.number().int(),
  offeredAmount: z.number().int().nullable(),
  applicableGuarantees: z.array(z.string()),
  omittedSpecialContract: z.array(z.string()),
  basisTermsPrecedents: z.array(z.string()),
  issue: z.array(z.string()),
  question: z.string().nullable(),
  adjusterId: z.uuid().nullable(),
  reviewComment: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  adjuster: z
    .object({
      nickname: z.string(),
      career: z.string().nullable(),
    })
    .nullable(),
});

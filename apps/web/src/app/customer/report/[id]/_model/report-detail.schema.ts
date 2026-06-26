import { z } from "zod";

/** 리포트 상세. 출처: API 명세 GET /reports/{reportId}. 필드명 명세 그대로. */

export const reportStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "MATCHED",
]);

export const issueStatusSchema = z.enum(["CONFIRMED", "TRUSTED", "INFO"]);

export const issueItemSchema = z.object({
  title: z.string(),
  opinion: z.string(),
  status: issueStatusSchema,
  tag: z.string().nullable(),
});

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
  issue: z.array(issueItemSchema),
  question: z.string().nullable(),
  adjusterId: z.uuid().nullable(),
  // 명세 GET 응답에 없는 디자인용 필드 — 부재 허용(nullish).
  confidenceLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).nullish(),
  reviewComment: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  adjuster: z
    .object({
      nickname: z.string(),
      career: z.string().nullable(),
    })
    .nullable(),
});

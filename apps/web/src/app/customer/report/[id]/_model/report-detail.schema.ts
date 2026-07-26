import { z } from "zod";

/** 리포트 상세. 출처: API 명세 GET /reports/{reportId}. 필드명 명세 그대로. */

export const reportStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "CLOSED",
  "NOT_SELECTED",
]);

export const issueItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  // 실제 스펙 type: string — 미확정 값 유입 시 파싱 실패 방지(표시는 소비처 fallback).
  aiStatus: z.string(),
  tags: z.array(z.string()).nullish(),
  impactAmount: z.number().int().nullish(),
});

export const reportDetailSchema = z.object({
  reportId: z.uuid(),
  status: reportStatusSchema,
  accidentType: z.string(),
  treatment: z.string(),
  // 미산정 리포트는 null.
  claimedMinAmount: z.number().int().nullable(),
  claimedMaxAmount: z.number().int().nullable(),
  offeredAmount: z.number().int().nullable(),
  applicableGuarantees: z.array(z.string()),
  omittedSpecialContract: z.array(z.string()),
  basisTermsPrecedents: z.array(z.string()),
  issues: z.array(issueItemSchema),
  question: z.string().nullable(),
  adjusterId: z.uuid().nullable(),
  // 명세 GET 응답에 없는 디자인용 필드 — 부재 허용(nullish).
  confidenceLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).nullish(),
  caseNo: z.string().nullish(),
  reviewComment: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  adjuster: z
    .object({
      nickname: z.string(),
      career: z.string().nullable(),
    })
    .nullable(),
});

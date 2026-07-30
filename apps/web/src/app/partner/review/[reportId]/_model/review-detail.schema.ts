import { z } from "zod";
import { reviewIssueSchema } from "./review-issue.schema";

/** 리포트 생명주기 상태 (ERD REPORTS.status 5상태). */
export const reviewReportStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "CLOSED",
  "NOT_SELECTED",
]);

/** 검수 방향(작업본 상태). */
export const reviewDirectionStatusSchema = z.enum([
  "SENT",
  "COUNSELING",
  "REJECTED",
  "ACCEPTED",
]);

export const reviewClientSchema = z.object({
  nickname: z.string(),
  gender: z.string(),
  birthDate: z.string(),
  region: z.string(),
  joinedAt: z.string(),
});

export const reviewClaimSchema = z.object({
  accidentType: z.string(),
  diagnosis: z.string(),
  accidentDate: z.string(),
  hospitalization: z.string().nullable(),
  description: z.string().nullable(),
  additionalInformation: z.string().nullable(),
  productName: z.string().nullable(),
  insurerName: z.string().nullable(),
});

export const reviewAttachmentSchema = z.object({
  attachmentId: z.string(),
  name: z.string(),
  mimeType: z.string(),
  url: z.string(),
  reportType: z.string().nullable(),
  pageCount: z.number().int().nullable(),
  issuedBy: z.string().nullable(),
  issuedAt: z.string().nullable(),
  aiSummary: z.string().nullable(),
});

// 미산정 리포트는 min/max null.
export const estimateRangeSchema = z.object({
  min: z.number().int().nullable(),
  max: z.number().int().nullable(),
});

export const reviewProgressSchema = z.object({
  total: z.number().int(),
  accepted: z.number().int(),
  modified: z.number().int(),
  excluded: z.number().int(),
});

export const reviewDetailSchema = z.object({
  reportId: z.uuid(),
  caseNo: z.string(),
  // 제목 미배정 케이스는 null.
  title: z.string().nullable(),
  // 백엔드 report.getAccidentType() null 가능(사고유형 미확정).
  accidentType: z.string().nullable(),
  region: z.string(),
  status: reviewReportStatusSchema,
  // 실제 스펙 enum 아닌 순수 string.
  confidenceLevel: z.string().nullable(),
  isMasked: z.boolean(),
  offeredAmount: z.number().int().nullable(),
  // 백엔드 ReviewContextRow(의뢰인·청구 맥락)가 없으면 client·claim 둘 다 null.
  client: reviewClientSchema.nullable(),
  claim: reviewClaimSchema.nullable(),
  attachments: z.array(reviewAttachmentSchema),
  aiEstimate: estimateRangeSchema,
  // started=false면 null(작업본 미생성).
  adjusterEstimate: estimateRangeSchema.nullable(),
  applicableGuarantees: z.array(z.string()),
  omittedSpecialContract: z.array(z.string()),
  basisTermsPrecedents: z.array(z.string()),
  issues: z.array(reviewIssueSchema),
  review: z.string().nullable(),
  reviewStatus: reviewDirectionStatusSchema.nullable(),
  started: z.boolean(),
  progress: reviewProgressSchema,
});

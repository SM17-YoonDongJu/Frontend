import { z } from "zod";
import { reviewIssueSchema } from "./review-issue.schema";

export const reviewReportStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "MATCHED",
]);

// ⚠️ 명세 드리프트: 의뢰인 기본정보는 GET 명세 미존재. MSW 확장 목킹, 비식별(가명정보) 노출.
export const reviewClientSchema = z.object({
  maskedName: z.string(),
  ageBand: z.string(),
  gender: z.string(),
  region: z.string(),
  joinedAt: z.string(),
});

// ⚠️ 명세 드리프트: 첨부자료 항목은 GET 명세 미존재. MSW 확장 목킹.
export const reviewAttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  fileType: z.string(),
  pageCount: z.number().int().nullable(),
  url: z.string(),
  issuedBy: z.string().nullable(),
  issuedAt: z.string().nullable(),
  aiSummary: z.string().nullable(),
});

// 입원 이력. 출처: API 명세 POST /reports body의 hospitalizations 형태와 동일.
export const hospitalizationSchema = z.object({
  hospitalStart: z.string().nullable(),
  hospitalEnd: z.string().nullable(),
  hospitalReason: z.string().nullable(),
});

export const reviewDetailSchema = z.object({
  reportId: z.uuid(),
  status: reviewReportStatusSchema,
  accidentType: z.string(),
  treatment: z.string(),
  claimedMinAmount: z.number().int(),
  claimedMaxAmount: z.number().int(),
  offeredAmount: z.number().int().nullable(),
  applicableGuarantees: z.array(z.string()),
  omittedSpecialContract: z.array(z.string()),
  basisTermsPrecedents: z.array(z.string()),
  question: z.string().nullable(),
  confidenceLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable(),
  adjusterId: z.uuid().nullable(),
  reviewComment: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  adjuster: z
    .object({ nickname: z.string(), career: z.string().nullable() })
    .nullable(),

  // ⚠️ 명세 드리프트: 아래 확장 필드는 GET /reports/{id} 명세 미존재. MSW 목킹, 백엔드 반영 요청.
  caseId: z.string(),
  accidentDate: z.string(),
  hospitalizations: z.array(hospitalizationSchema),
  description: z.string().nullable(),
  client: reviewClientSchema,
  isMasked: z.boolean(),
  attachments: z.array(reviewAttachmentSchema),
  // ⚠️ 명세 드리프트: 명세 issue는 string[]. 리치 reviewIssues로 superset 반환.
  reviewIssues: z.array(reviewIssueSchema),
});

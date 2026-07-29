import { z } from "zod";

/**
 * 리포트 상세. 출처: API 명세 GET /reports/{reportId}(백엔드 CustomerReportDetailResponse).
 * 백엔드 필드 issue(단수)·reportNo는 기존 소비처(issues·caseNo) 무변경을 위해 파싱 시 별칭을 추가한다.
 */

export const reportStatusSchema = z.enum([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  // 백엔드가 고객 노출 시 CLOSED를 MATCHED로 매핑 — CLOSED는 내려오지 않는다.
  "MATCHED",
  "NOT_SELECTED",
]);

// 백엔드 IssueItem{title,opinion,status,tags,impactAmount} → 기존 소비처(description·aiStatus) 필드명 유지.
export const issueItemSchema = z
  .object({
    title: z.string(),
    opinion: z.string(),
    status: z.string(),
    tags: z.array(z.string()),
    impactAmount: z.number().int().nullable(),
  })
  .transform((issue) => ({
    title: issue.title,
    description: issue.opinion,
    aiStatus: issue.status,
    tags: issue.tags,
    impactAmount: issue.impactAmount,
  }));

const rawReportDetailSchema = z.object({
  reportId: z.uuid(),
  status: reportStatusSchema,
  accidentType: z.string().nullable(),
  treatment: z.string(),
  claimedMinAmount: z.number().int().nullable(),
  claimedMaxAmount: z.number().int().nullable(),
  offeredAmount: z.number().int().nullable(),
  applicableGuarantees: z.array(z.string()),
  omittedSpecialContract: z.array(z.string()),
  basisTermsPrecedents: z.array(z.string()),
  issue: z.array(issueItemSchema),
  question: z.string().nullable(),
  adjusterId: z.uuid().nullable(),
  confidenceLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable(),
  reportNo: z.string().nullable(),
  reviewComment: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  adjuster: z
    .object({
      nickname: z.string(),
      // 연차(정수). 표시용 포맷("N년차")은 소비처 책임.
      career: z.number().int().nullable(),
    })
    .nullable(),
});

export const reportDetailSchema = rawReportDetailSchema.transform((data) => ({
  ...data,
  issues: data.issue,
  caseNo: data.reportNo,
}));

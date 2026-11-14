import { z } from "zod";
import type { CustomerReportDetailResponse, IssueItem } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";
import { enumWithFallback } from "@/shared/lib/enum-with-fallback";
import { analysisStateSchema } from "@/app/customer/_shared/model/analysis-state";

/**
 * 리포트 상세. 출처: API 명세 GET /reports/{reportId}(백엔드 CustomerReportDetailResponse).
 * 백엔드 필드 issue(단수)·reportNo는 기존 소비처(issues·caseNo) 무변경을 위해 파싱 시 별칭을 추가한다.
 */

export const reportStatusSchema = enumWithFallback([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
  // 백엔드가 고객 노출 시 CLOSED를 MATCHED로 매핑 — CLOSED는 내려오지 않는다.
  "MATCHED",
  "NOT_SELECTED",
  // 분석이 멈춘 리포트(AI 워커가 기록)는 고객 응답에서도 그대로 내려온다.
  "BLOCKED",
  "NEEDS_REUPLOAD",
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
  treatment: z.string().nullable(),
  claimedMinAmount: z.number().int().nullable(),
  claimedMaxAmount: z.number().int().nullable(),
  offeredAmount: z.number().int().nullable(),
  applicableGuarantees: z.array(z.string()),
  omittedSpecialContract: z.array(z.string()),
  basisTermsPrecedents: z.array(z.string()),
  issue: z.array(issueItemSchema),
  question: z.string().nullable(),
  adjusterId: z.uuid().nullable(),
  confidenceLevel: enumWithFallback(["LOW", "MEDIUM", "HIGH"]).nullable(),
  analysisState: analysisStateSchema,
  // 사유 코드는 값이 늘어날 수 있어 문자열로 받는다. 문구는 백엔드가 정해 그대로 보여준다.
  analysisFailureReason: z.string().nullish(),
  analysisFailureMessage: z.string().nullish(),
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

type _IssueItemDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.input<typeof issueItemSchema>, IssueItem>
>;

// 변환 전(rawReportDetailSchema) 필드명이 명세와 그대로 일치 — issue/reportNo→issues/caseNo 별칭은
// 여기서만 일어나므로 원본 키 기준으로 대조한다.
type _ReportDetailDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<
    Omit<z.infer<typeof rawReportDetailSchema>, "adjuster">,
    CustomerReportDetailResponse
  >
>;

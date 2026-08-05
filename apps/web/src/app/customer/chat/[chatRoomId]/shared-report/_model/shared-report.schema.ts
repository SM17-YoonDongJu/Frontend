import { z } from "zod";
import type { Estimate, Issue, SharedReportResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

// 채팅방 공유 리포트 계약(봉투 내부 data만 — fetch-json이 봉투 해제·snake→camel 변환).
// 같은 리포트라도 방마다 사정사별 검수본이 달라 키·조회 단위는 chatRoomId.

// 값 집합이 명세에 없어 잠그지 않는다(화면 분기에도 쓰지 않음).
export const sharedReportStatusSchema = z.string();

export const sharedReviewStatusSchema = z.enum([
  "SENT",
  "COUNSELING",
  "REJECTED",
  "ACCEPTED",
]);

// 쟁점 판정. EXCLUDED는 공유 리포트에서 제외돼 내려오지 않는다(명세 3값).
export const sharedIssueReviewStatusSchema = z.enum([
  "ACCEPTED",
  "MODIFIED",
  "ADDED",
]);

export const sharedReportAdjusterSchema = z.object({
  adjusterId: z.uuid(),
  name: z.string(),
  career: z.number().int().nullable(),
  specialties: z.array(z.string()),
});

// 미산정 시 min/max null.
export const sharedReportEstimateSchema = z.object({
  min: z.number().int().nullable(),
  max: z.number().int().nullable(),
});

export const sharedReportIssueSchema = z.object({
  issueId: z.uuid().nullable(), // 사정사 신규 추가 쟁점(ADDED)은 원본 쟁점이 없어 null
  reviewIssueId: z.uuid(), // 목록 key는 이 값 사용(항상 존재)
  title: z.string(),
  adjusterOpinion: z.string(),
  description: z.string().nullable(),
  impactAmount: z.number().int().nullable(),
  reviewStatus: sharedIssueReviewStatusSchema,
  tags: z.array(z.string()),
});

export const sharedReportSchema = z.object({
  chatRoomId: z.uuid(),
  reportId: z.uuid(),
  proposalId: z.uuid(),
  caseNo: z.string(),
  accidentType: z.string().nullable(),
  title: z.string().nullable(),
  reportStatus: sharedReportStatusSchema,
  reviewStatus: sharedReviewStatusSchema,
  reportUpdatedAt: z.string(),
  submittedAt: z.string(),
  summary: z.string().nullable(),
  adjuster: sharedReportAdjusterSchema,
  estimate: sharedReportEstimateSchema,
  offeredAmount: z.number().int().nullable(),
  issues: z.array(sharedReportIssueSchema),
  issueCount: z.number().int(),
  applicableGuarantees: z.array(z.string()),
  omittedSpecialContract: z.array(z.string()),
  basisTermsPrecedents: z.array(z.string()),
});

export type SharedReport = z.infer<typeof sharedReportSchema>;
export type SharedReportIssue = z.infer<typeof sharedReportIssueSchema>;
export type SharedReportAdjuster = z.infer<typeof sharedReportAdjusterSchema>;
export type SharedReportEstimate = z.infer<typeof sharedReportEstimateSchema>;
export type SharedIssueReviewStatus = z.infer<
  typeof sharedIssueReviewStatusSchema
>;
export type SharedReviewStatus = z.infer<typeof sharedReviewStatusSchema>;

// adjuster는 명세 Adjuster 타입이 {nickname,career}뿐인데 우리는 adjusterId·name·specialties도
// 쓴다(실제 응답과 다른 범용 타입 재사용 추정) — 얕은 대조에서 제외, 별도 확인 필요로 남겨둔다.
type _SharedReportDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<SharedReport, "adjuster" | "issues">, SharedReportResponse>
>;
type _SharedReportIssueDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<SharedReportIssue, Issue>
>;
type _SharedReportEstimateDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<SharedReportEstimate, Estimate>
>;

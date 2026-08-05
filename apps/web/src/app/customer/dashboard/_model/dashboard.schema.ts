import { z } from "zod";
import { reportListStatusSchema } from "@/app/customer/_shared/model/report-list.schema";
import type { ActiveReport, ProposalSummary, UserDashboardResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

/**
 * 고객 홈 대시보드 BFF(GET /users/me/dashboard) 응답 거울 — 이슈 #142.
 * BE 합의(PR #142·구현 PR #171): reportCount·activeReport·proposalSummary 3필드만. todos는 미제공(액션센터가 파생).
 * 응답 래퍼(status/message/code)는 client가 해제 — 여기선 data 페이로드만 모델링(snake→camel도 client 담당).
 */
export const dashboardActiveReportSchema = z.object({
  reportId: z.uuid(),
  title: z.string().nullable(),
  accidentType: z.string(),
  status: reportListStatusSchema,
  createdAt: z.string(),
  firstReviewedAt: z.string().nullable(),
  proposalCount: z.number().int().nonnegative(),
});

export const dashboardProposalItemSchema = z.object({
  proposalId: z.uuid(),
  adjusterId: z.uuid(),
  nickname: z.string(),
  // 프로필 미기입 사정사는 career·speciality null.
  career: z.number().int().nonnegative().nullable(),
  speciality: z.string().nullable(),
  // 견적 미기입 제안은 null.
  estimateMinAmount: z.number().int().nonnegative().nullable(),
  estimateMaxAmount: z.number().int().nonnegative().nullable(),
});

export const dashboardProposalSummarySchema = z.object({
  count: z.number().int().nonnegative(),
  // 견적 미기입 제안만 있으면 집계 금액 null.
  minAmount: z.number().int().nonnegative().nullable(),
  maxAmount: z.number().int().nonnegative().nullable(),
  avgAmount: z.number().int().nonnegative().nullable(),
  items: z.array(dashboardProposalItemSchema),
});

export const dashboardSchema = z.object({
  reportCount: z.number().int().nonnegative(),
  activeReport: dashboardActiveReportSchema.nullable(),
  proposalSummary: dashboardProposalSummarySchema.nullable(),
});

export type Dashboard = z.infer<typeof dashboardSchema>;
export type DashboardActiveReport = z.infer<typeof dashboardActiveReportSchema>;
export type DashboardProposalSummary = z.infer<typeof dashboardProposalSummarySchema>;
export type DashboardProposalItem = z.infer<typeof dashboardProposalItemSchema>;

type _DashboardDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<Dashboard, "activeReport" | "proposalSummary">, UserDashboardResponse>
>;
type _DashboardActiveReportDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<DashboardActiveReport, ActiveReport>
>;
type _DashboardProposalSummaryDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<DashboardProposalSummary, "items">, ProposalSummary>
>;

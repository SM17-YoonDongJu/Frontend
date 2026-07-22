import { z } from "zod";
import { reportListStatusSchema } from "@/app/customer/_shared/model/report-list.schema";

/**
 * 고객 홈 대시보드 BFF(GET /users/me/dashboard) 응답 거울 — 이슈 #142.
 * 🏷 백엔드 확정 대기. 단일 진실: .pr-assets/api-spec-draft-customer-dashboard-bff.md.
 * 봉투(status/message/code)는 fetchJson이 해제 — 여기선 data 페이로드만 모델링(snake→camel도 fetchJson 담당).
 */
export const dashboardActiveReportSchema = z.object({
  reportId: z.uuid(),
  title: z.string(),
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
  career: z.number().int().nonnegative(),
  speciality: z.string(),
  estimateMinAmount: z.number().int().nonnegative(),
  estimateMaxAmount: z.number().int().nonnegative(),
});

export const dashboardProposalSummarySchema = z.object({
  count: z.number().int().nonnegative(),
  minAmount: z.number().int().nonnegative(),
  maxAmount: z.number().int().nonnegative(),
  avgAmount: z.number().int().nonnegative(),
  items: z.array(dashboardProposalItemSchema),
});

export const dashboardUnreadChatSchema = z.object({
  chatRoomId: z.uuid(),
  adjusterNickname: z.string(),
  lastMessage: z.string(),
});

export const dashboardTodosSchema = z.object({
  unreadProposalCount: z.number().int().nonnegative(),
  unreadReviewCompleteCount: z.number().int().nonnegative(),
  unreadChat: dashboardUnreadChatSchema.nullable(),
});

export const dashboardSchema = z.object({
  reportCount: z.number().int().nonnegative(),
  activeReport: dashboardActiveReportSchema.nullable(),
  proposalSummary: dashboardProposalSummarySchema.nullable(),
  todos: dashboardTodosSchema,
});

export type Dashboard = z.infer<typeof dashboardSchema>;
export type DashboardActiveReport = z.infer<typeof dashboardActiveReportSchema>;
export type DashboardProposalSummary = z.infer<typeof dashboardProposalSummarySchema>;
export type DashboardProposalItem = z.infer<typeof dashboardProposalItemSchema>;
export type DashboardTodos = z.infer<typeof dashboardTodosSchema>;
export type DashboardUnreadChat = z.infer<typeof dashboardUnreadChatSchema>;

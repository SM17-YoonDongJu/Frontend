import { reportDetailHref } from "@/app/customer/_shared/model/report-routes";

export const DASHBOARD_LINKS = {
  newAnalysis: "/customer/adjust-request",
  allReports: "/customer/reports",
  report: reportDetailHref,
  proposals: (reportId: string) => `/customer/proposals/${reportId}`,
  proposalsList: "/customer/proposals",
  chat: "/customer/chat",
  chatRoom: (chatRoomId: string) => `/customer/chat/${chatRoomId}`,
  adjusterFinder: "/customer/adjusters",
} as const;

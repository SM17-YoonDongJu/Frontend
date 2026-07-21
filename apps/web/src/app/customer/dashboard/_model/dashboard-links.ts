import { reportDetailHref } from "@/app/customer/_shared/model/report-routes";

export const DASHBOARD_LINKS = {
  newAnalysis: "/customer/adjust-request",
  allReports: "/customer/reports",
  report: reportDetailHref,
  proposals: (reportId: string) => `/customer/proposals/${reportId}`,
  chat: "/customer/chat",
  adjusterFinder: "/customer/adjusters",
} as const;

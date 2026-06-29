export const DASHBOARD_LINKS = {
  newAnalysis: "/customer/adjust-request",
  allReports: "/customer/reports",
  report: (reportId: string) => `/customer/report/${reportId}`,
  proposals: (reportId: string) => `/customer/proposals/${reportId}`,
} as const;

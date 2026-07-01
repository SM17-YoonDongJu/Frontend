import type { z } from "zod";
import type { adjusterProfileSchema } from "./profile.schema";
import type {
  dashboardSummarySchema,
  dashboardActivitySchema,
  dashboardSchema,
  inProgressStatusSchema,
  inProgressCaseSchema,
  inProgressListSchema,
} from "./dashboard.schema";

export type AdjusterProfile = z.infer<typeof adjusterProfileSchema>;
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
export type DashboardActivity = z.infer<typeof dashboardActivitySchema>;
export type Dashboard = z.infer<typeof dashboardSchema>;
export type InProgressStatus = z.infer<typeof inProgressStatusSchema>;
export type InProgressCase = z.infer<typeof inProgressCaseSchema>;
export type InProgressList = z.infer<typeof inProgressListSchema>;

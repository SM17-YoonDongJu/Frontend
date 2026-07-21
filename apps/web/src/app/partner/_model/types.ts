import type { z } from "zod";
import type { adjusterProfileSchema } from "./profile.schema";
import type {
  adjusterHomeSchema,
  homeAdjusterSchema,
  homeInProgressCaseSchema,
  homeInProgressSchema,
  homeRatingSchema,
  homeSummarySchema,
} from "./home.schema";

export type AdjusterProfile = z.infer<typeof adjusterProfileSchema>;
export type HomeAdjuster = z.infer<typeof homeAdjusterSchema>;
export type HomeRating = z.infer<typeof homeRatingSchema>;
export type HomeSummary = z.infer<typeof homeSummarySchema>;
export type HomeInProgressCase = z.infer<typeof homeInProgressCaseSchema>;
export type HomeInProgress = z.infer<typeof homeInProgressSchema>;
export type AdjusterHome = z.infer<typeof adjusterHomeSchema>;

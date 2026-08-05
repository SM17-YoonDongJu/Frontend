import type { z } from "zod";
import type { adjusterProfileSchema } from "./profile.schema";
import type {
  adjusterHomeSchema,
  homeInProgressCaseSchema,
} from "./home.schema";

export type AdjusterProfile = z.infer<typeof adjusterProfileSchema>;
export type HomeInProgressCase = z.infer<typeof homeInProgressCaseSchema>;
export type AdjusterHome = z.infer<typeof adjusterHomeSchema>;

import type { z } from "zod";
import type {
  adjusterHomeSchema,
  homeInProgressCaseSchema,
} from "./home.schema";

export type HomeInProgressCase = z.infer<typeof homeInProgressCaseSchema>;
export type AdjusterHome = z.infer<typeof adjusterHomeSchema>;

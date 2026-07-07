import type { z } from "zod";
import type { reviewSummarySchema } from "./review.schema";

export type ReviewSummary = z.infer<typeof reviewSummarySchema>;

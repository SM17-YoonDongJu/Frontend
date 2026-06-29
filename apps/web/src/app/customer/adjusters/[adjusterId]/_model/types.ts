import type { z } from "zod";
import type {
  adjusterDetailSchema,
  adjusterCareerSchema,
  adjusterReviewSchema,
  consultGuideSchema,
  certificationSchema,
} from "./adjuster-detail.schema";

export type AdjusterDetail = z.infer<typeof adjusterDetailSchema>;
export type AdjusterCareer = z.infer<typeof adjusterCareerSchema>;
export type AdjusterReview = z.infer<typeof adjusterReviewSchema>;
export type ConsultGuide = z.infer<typeof consultGuideSchema>;
export type Certification = z.infer<typeof certificationSchema>;

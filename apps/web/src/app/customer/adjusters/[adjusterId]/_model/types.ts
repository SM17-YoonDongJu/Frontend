import type { z } from "zod";
import type {
  adjusterDetailSchema,
  adjusterCareerSchema,
  adjusterReviewSchema,
  consultGuideSchema,
  certificationSchema,
} from "./adjuster-detail.schema";
import type { AdjusterDetailResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

export type AdjusterDetail = z.infer<typeof adjusterDetailSchema>;
export type AdjusterCareer = z.infer<typeof adjusterCareerSchema>;
export type AdjusterReview = z.infer<typeof adjusterReviewSchema>;
export type ConsultGuide = z.infer<typeof consultGuideSchema>;
export type Certification = z.infer<typeof certificationSchema>;

// consultGuide·certification은 실 API 미정 필드(MSW 선제공) — 대조 대상에서 제외.
type _AdjusterDetailDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<
    Omit<AdjusterDetail, "consultGuide" | "certification">,
    AdjusterDetailResponse
  >
>;

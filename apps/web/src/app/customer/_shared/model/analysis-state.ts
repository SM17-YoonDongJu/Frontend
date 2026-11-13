import type { z } from "zod";
import { enumWithFallback } from "@/shared/lib/enum-with-fallback";

/** 분석(OCR·AI) 처리 상태. 리포트 진행 상태(status)와 다른 축이다. */
export const analysisStateSchema = enumWithFallback([
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "BLOCKED",
  "NEEDS_REUPLOAD",
]);

export type AnalysisState = z.infer<typeof analysisStateSchema>;

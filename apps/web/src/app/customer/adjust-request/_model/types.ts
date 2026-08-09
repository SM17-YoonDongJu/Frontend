import type { z } from "zod";
import type {
  accidentTypeSchema,
  treatmentTypeSchema,
  nonCoveredOptionSchema,
  hospitalizationSchema,
  createReportBodySchema,
  createReportResponseSchema,
  adjustRequestDraftSchema,
} from "./report-request.schema";

/** 퍼널 타입 — z.infer로 도출(interface 중복 금지). */
export type AccidentType = z.infer<typeof accidentTypeSchema>;
export type TreatmentType = z.infer<typeof treatmentTypeSchema>;
export type NonCoveredOption = z.infer<typeof nonCoveredOptionSchema>;
export type Hospitalization = z.infer<typeof hospitalizationSchema>;
export type CreateReportBody = z.infer<typeof createReportBodySchema>;
export type CreateReportResponse = z.infer<typeof createReportResponseSchema>;
export type AdjustRequestDraft = z.infer<typeof adjustRequestDraftSchema>;

export type { DocumentSlotKey, DocumentSlotValue, DocumentSlots } from "./document-slots";

import type { z } from "zod";
import type { accidentTypeSchema, adjustRequestDraftSchema } from "./report-request.schema";

/** 퍼널 타입 — z.infer로 도출(interface 중복 금지). */
export type AccidentType = z.infer<typeof accidentTypeSchema>;
export type AdjustRequestDraft = z.infer<typeof adjustRequestDraftSchema>;

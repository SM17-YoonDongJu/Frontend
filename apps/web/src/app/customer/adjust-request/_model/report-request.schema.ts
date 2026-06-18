import { z } from "zod";

/** 손해사정 요청 퍼널 입력 스키마. 도메인 = report (슬러그만 adjust-request). */

/** MVP는 실손 의료비 단일. 그 외는 UNSUPPORTED_OPERATION. */
export const accidentTypeSchema = z.enum(["MEDICAL_EXPENSE"]);

export const step1AccidentTypeSchema = z.object({
  accidentType: accidentTypeSchema,
});

/** 자동저장용 — 부분 입력 허용. 슬라이스마다 필드 추가. */
export const adjustRequestDraftSchema = z.object({
  accidentType: accidentTypeSchema.optional(),
});

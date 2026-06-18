import { z } from "zod";

/** 손해사정 요청 퍼널 입력 스키마. 도메인 = report (슬러그만 adjust-request). */

/** MVP는 실손 의료비 단일. 그 외는 UNSUPPORTED_OPERATION. */
export const accidentTypeSchema = z.enum(["MEDICAL_EXPENSE"]);

/** 치료 형태(복수). FE 내부 표현 — 제출 시 additionalInformation으로 직렬화. */
export const treatmentTypeSchema = z.enum(["ADMISSION", "OUTPATIENT", "MEDICATION", "SURGERY"]);

/** 비급여 포함 여부. */
export const nonCoveredOptionSchema = z.enum(["INCLUDED", "EXCLUDED", "UNKNOWN"]);

export const step1AccidentTypeSchema = z.object({
  accidentType: accidentTypeSchema,
});

/** 입원 1건 — "입원 추가하기"로 동적 추가. */
export const hospitalizationSchema = z
  .object({
    start: z.string().min(1, "입원일을 선택하세요."), // YYYY-MM-DD
    end: z.string().nullish(),
    reason: z.string().nullish(),
  })
  .refine((v) => !v.end || v.end >= v.start, {
    path: ["end"],
    message: "퇴원일은 입원일 이후여야 합니다.",
  });

export const step3DateSchema = z.object({
  accidentDate: z.string().min(1, "사고 발생일을 선택하세요."), // YYYY-MM-DD
  hospitalizations: z.array(hospitalizationSchema).optional(),
});

export const step2TreatmentSchema = z.object({
  treatmentTypes: z.array(treatmentTypeSchema).min(1, "치료 형태를 선택하세요."),
  diagnosis: z.string().min(1, "진단명·치료 내용을 입력하세요."),
  treatmentCount: z.number().int().min(0).nullish(), // 입원·통원 횟수(회), 선택
  totalTreatmentCost: z.number().int().min(0).nullish(), // 총 치료비 본인부담(원), 선택
  nonCoveredOption: nonCoveredOptionSchema,
  enrolledInsurance: z.string().nullish(),
});

export const step4InsuranceSchema = z
  .object({
    insuranceNotOffered: z.boolean(),
    insuranceOffered: z.number().int().min(0).nullish(), // 제안받은 보험금(원)
  })
  .refine((v) => v.insuranceNotOffered || v.insuranceOffered != null, {
    path: ["insuranceOffered"],
    message: "제안받은 보험금을 입력하거나 '아직 제안받지 않았어요'를 선택하세요.",
  });

/** 자동저장용 — 부분 입력 허용. 슬라이스마다 필드 추가. */
export const adjustRequestDraftSchema = z.object({
  accidentType: accidentTypeSchema.optional(),
  treatmentTypes: z.array(treatmentTypeSchema).optional(),
  diagnosis: z.string().optional(),
  treatmentCount: z.number().int().min(0).nullable().optional(),
  totalTreatmentCost: z.number().int().min(0).nullable().optional(),
  nonCoveredOption: nonCoveredOptionSchema.optional(),
  enrolledInsurance: z.string().nullable().optional(),
  accidentDate: z.string().optional(),
  hospitalizations: z.array(hospitalizationSchema).optional(),
  insuranceNotOffered: z.boolean().optional(),
  insuranceOffered: z.number().int().min(0).nullish(),
});

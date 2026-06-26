import { z } from "zod";
import {
  accidentTypeSchema,
  SUPPORTED_ACCIDENT_TYPE,
} from "@/shared/model/accident-type";

/** 손해사정 요청 퍼널 입력 스키마. 도메인 = report (슬러그만 adjust-request). */

/** 사고 유형 enum은 shared 단일 진실 재사용(MVP는 medical_indemnity만 분석). */
export { accidentTypeSchema };

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

export const step5DocumentSchema = z.object({
  documentUrls: z.array(z.url()).nullish(), // 업로드된 증빙 url, 선택
});

/** POST /uploads 응답 data. */
export const uploadDocumentResponseSchema = z.object({
  url: z.url(),
});

export const step6ConsentSchema = z.object({
  agreedToPrivacy: z.literal(true, { message: "민감정보 처리에 동의해 주세요." }),
  agreedToTerms: z.literal(true, { message: "필수 고지사항을 확인해 주세요." }),
});

/** POST /reports 요청 body (naming-dictionary §3). */
export const createReportBodySchema = z.object({
  productId: z.uuid().optional(), // 퍼널에 상품선택 없음 → 생략
  accidentType: accidentTypeSchema,
  accidentDate: z.string().date(),
  diagnosis: z.string().min(1),
  offeredAmount: z.number().int().nullable(),
  hospitalStart: z.string().nullable(),
  hospitalEnd: z.string().nullable(),
  description: z.string().nullable(),
  additionalInformation: z.string().nullable(),
  documentUrls: z.array(z.url()).nullable(),
  question: z.string().nullable(),
});

/** POST /reports 응답 data. */
export const createReportResponseSchema = z.object({
  reportId: z.uuid(),
  status: z.string(), // CONTRACT: 생성 직후 status 백엔드 확인(MSW는 AWAITING_INSPECTION)
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
  documentUrls: z.array(z.url()).nullish(),
  agreedToPrivacy: z.boolean().optional(),
  agreedToTerms: z.boolean().optional(),
});

const TREATMENT_LABELS: Record<z.infer<typeof treatmentTypeSchema>, string> = {
  ADMISSION: "입원",
  OUTPATIENT: "통원",
  MEDICATION: "약제",
  SURGERY: "수술",
};
const NON_COVERED_LABELS: Record<z.infer<typeof nonCoveredOptionSchema>, string> = {
  INCLUDED: "포함",
  EXCLUDED: "미포함",
  UNKNOWN: "모름",
};

/** 무매핑 입력을 사정사가 읽을 라벨:값 텍스트로 직렬화(기계 파싱 아님 → 가독성 우선). */
function serializeAdditionalInformation(draft: AdjustRequestDraftInput): string | null {
  const lines: string[] = [];
  if (draft.treatmentTypes?.length) {
    lines.push(`치료형태: ${draft.treatmentTypes.map((t) => TREATMENT_LABELS[t]).join(", ")}`);
  }
  if (draft.treatmentCount != null) lines.push(`입원·통원 횟수: ${draft.treatmentCount}회`);
  if (draft.totalTreatmentCost != null) lines.push(`총 치료비(본인부담): ${draft.totalTreatmentCost}원`);
  if (draft.nonCoveredOption) lines.push(`비급여 포함 여부: ${NON_COVERED_LABELS[draft.nonCoveredOption]}`);
  if (draft.enrolledInsurance) lines.push(`가입보험·특약: ${draft.enrolledInsurance}`);

  const reasons = (draft.hospitalizations ?? [])
    .map((h, i) => (h.reason ? `입원 ${i + 1} 사유: ${h.reason}` : null))
    .filter((v): v is string => v !== null);
  lines.push(...reasons);

  return lines.length ? lines.join("\n") : null;
}

type AdjustRequestDraftInput = z.infer<typeof adjustRequestDraftSchema>;

/**
 * draft를 POST /reports body로 변환.
 * 입원 기록 배열 → hospitalStart(최초 입원일)·hospitalEnd(최종 퇴원일)로 압축,
 * 입원 사유 등 무매핑 입력은 additionalInformation으로.
 */
export function toCreateReportBody(
  draft: AdjustRequestDraftInput,
): z.infer<typeof createReportBodySchema> {
  const stays = draft.hospitalizations ?? [];
  const starts = stays.map((s) => s.start).filter(Boolean).sort();
  const ends = stays.map((s) => s.end).filter((v): v is string => !!v).sort();

  return createReportBodySchema.parse({
    accidentType: draft.accidentType ?? SUPPORTED_ACCIDENT_TYPE,
    accidentDate: draft.accidentDate,
    diagnosis: draft.diagnosis,
    offeredAmount: draft.insuranceNotOffered ? null : (draft.insuranceOffered ?? null),
    hospitalStart: starts[0] ?? null,
    hospitalEnd: ends[ends.length - 1] ?? null,
    description: null,
    additionalInformation: serializeAdditionalInformation(draft),
    documentUrls: draft.documentUrls ?? null,
    question: null,
  });
}

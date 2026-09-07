import { z } from "zod";
import {
  accidentTypeSchema,
  SUPPORTED_ACCIDENT_TYPE,
} from "@/shared/model/accident-type";
import { documentSlotsSchema, flattenDocuments, REQUIRED_DOCUMENT_SLOTS } from "./document-slots";
import type { CreateReportRequest, CreateReportResponse as GenCreateReportResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

/** 손해사정 요청 퍼널 입력 스키마. 도메인 = report (슬러그만 adjust-request). */

/** 사고 유형 enum은 shared 단일 진실 재사용(MVP는 medical_indemnity만 분석). */
export { accidentTypeSchema };

/** 치료 형태(복수). FE 내부 표현 — 제출 시 additionalInformation으로 직렬화. */
export const treatmentTypeSchema = z.enum(["ADMISSION", "OUTPATIENT", "MEDICATION", "SURGERY"]);

/** 비급여 포함 여부. */
export const nonCoveredOptionSchema = z.enum(["INCLUDED", "EXCLUDED", "UNKNOWN"]);

export const step1AccidentTypeSchema = z.object({
  accidentType: z.enum(accidentTypeSchema.options, { message: "사고 유형을 선택하세요." }),
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
  treatmentTypes: z
    .array(treatmentTypeSchema, { message: "치료 형태를 선택하세요." })
    .min(1, "치료 형태를 선택하세요."),
  diagnosis: z
    .array(z.string(), { message: "진단명을 입력하세요." })
    .refine((rows) => rows.some((r) => r.trim().length > 0), "진단명을 입력하세요."),
  treatmentCount: z
    .number({ message: "숫자를 입력하세요." })
    .int("숫자를 입력하세요.")
    .min(0, "0 이상의 숫자를 입력하세요.")
    .nullish(), // 입원·통원 횟수(회), 선택
  totalTreatmentCost: z
    .number({ message: "숫자를 입력하세요." })
    .int("숫자를 입력하세요.")
    .min(0, "0 이상의 숫자를 입력하세요.")
    .nullish(), // 총 치료비 본인부담(원), 선택
  nonCoveredOption: z.enum(nonCoveredOptionSchema.options, {
    message: "비급여 포함 여부를 선택하세요.",
  }),
  enrolledInsurance: z.string().nullish(),
});

export const step4InsuranceSchema = z
  .object({
    insuranceNotOffered: z.boolean().optional(), // 미체크 = 미선택(false 취급)
    insuranceOffered: z
      .number({ message: "숫자를 입력하세요." })
      .int("숫자를 입력하세요.")
      .min(0, "0 이상의 숫자를 입력하세요.")
      .nullish(), // 제안받은 보험금(원)
  })
  .refine((v) => v.insuranceNotOffered || v.insuranceOffered != null, {
    path: ["insuranceOffered"],
    message: "제안받은 보험금을 입력하거나 '아직 제안받지 않았어요'를 선택하세요.",
  });

export const QUESTION_MAX_LENGTH = 500;

export const step5QuestionSchema = z.object({
  question: z
    .string()
    .max(QUESTION_MAX_LENGTH, `${QUESTION_MAX_LENGTH}자까지 입력할 수 있어요.`)
    .nullish(), // 손해사정사에게 전할 말, 선택
});

const REQUIRED_DOCUMENT_LABELS = REQUIRED_DOCUMENT_SLOTS.map((d) => d.label).join("·");

export const step6DocumentSchema = z
  .object({
    documentUrls: z
      .array(z.url("파일 업로드 상태를 다시 확인해 주세요."), {
        message: "파일 업로드 상태를 다시 확인해 주세요.",
      })
      .nullish(), // 슬롯 + 기타 서류 url 평면화 결과
    documentSlots: documentSlotsSchema.optional(),
  })
  // 필수 서류 없이는 OCR 분석이 시작되지 않는다. 안내는 폼에 표시 가능한 documentUrls 경로로 붙인다.
  .refine((v) => REQUIRED_DOCUMENT_SLOTS.every((d) => v.documentSlots?.[d.key]?.url), {
    path: ["documentUrls"],
    message: `${REQUIRED_DOCUMENT_LABELS} 첨부 후 진행할 수 있어요.`,
  });

export const step7ConsentSchema = z.object({
  agreedToPrivacy: z.literal(true, { message: "민감정보 처리에 동의해 주세요." }),
  agreedToTerms: z.literal(true, { message: "필수 고지사항을 확인해 주세요." }),
});

/**
 * POST /reports body의 documents[] 항목. 명세(37b30798…570d) Document:
 * s3_url·name·report_type·file_type 전부 Y(요청 시 camel→snake 자동 변환).
 */
export const documentSchema = z.object({
  s3Url: z.url(),
  name: z.string().min(1),
  reportType: z.string().min(1),
  // CONTRACT: 명세는 file_type 필수(.pdf/.jpg 등)이나 업로드 url에 확장자가 없을 수 있어 빈 문자열 허용.
  fileType: z.string(),
});

/** POST /reports 요청 body (naming-dictionary §3). */
export const createReportBodySchema = z.object({
  productId: z.uuid().optional(), // 퍼널에 상품선택 없음 → 생략
  accidentType: accidentTypeSchema,
  accidentDate: z.string().date(),
  diagnosis: z.array(z.string().min(1)).min(1),
  offeredAmount: z.number().int().nullable(),
  hospitalizations: z
    .array(
      z.object({
        hospitalStart: z.string(),
        hospitalEnd: z.string().nullable(),
        hospitalReason: z.string().nullable(),
      }),
    )
    .nullable(),
  description: z.string().nullable(),
  additionalInformation: z.string().nullable(),
  documents: z.array(documentSchema).nullable(),
  question: z.string().nullable(),
});

/** POST /reports 응답 data. */
export const createReportResponseSchema = z.object({
  reportId: z.uuid(),
  status: z.string(), // CONTRACT: 생성 직후 status 백엔드 확인(MSW는 AWAITING_INSPECTION)
});

type _CreateReportBodyDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof createReportBodySchema>, CreateReportRequest>
>;
type _CreateReportResponseDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof createReportResponseSchema>, GenCreateReportResponse>
>;

/** 자동저장용 — 부분 입력 허용. 슬라이스마다 필드 추가. */
export const adjustRequestDraftSchema = z.object({
  accidentType: accidentTypeSchema.optional(),
  treatmentTypes: z.array(treatmentTypeSchema).optional(),
  diagnosis: z.array(z.string()).optional(),
  treatmentCount: z.number().int().min(0).nullable().optional(),
  totalTreatmentCost: z.number().int().min(0).nullable().optional(),
  nonCoveredOption: nonCoveredOptionSchema.optional(),
  enrolledInsurance: z.string().nullable().optional(),
  accidentDate: z.string().optional(),
  hospitalizations: z.array(hospitalizationSchema).optional(),
  insuranceNotOffered: z.boolean().optional(),
  insuranceOffered: z.number().int().min(0).nullish(),
  question: z.string().max(QUESTION_MAX_LENGTH).nullish(),
  documentUrls: z.array(z.url()).nullish(),
  documentSlots: documentSlotsSchema.optional(), // 슬롯→업로드 결과(복원용). 제출은 documentUrls로 평면화.
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

  return lines.length ? lines.join("\n") : null;
}

type AdjustRequestDraftInput = z.infer<typeof adjustRequestDraftSchema>;

/**
 * draft를 POST /reports body로 변환.
 * 입원 기록은 명세 hospitalizations 배열로 그대로 전달(사유 포함),
 * 치료형태 등 무매핑 입력만 additionalInformation으로.
 */
export function toCreateReportBody(
  draft: AdjustRequestDraftInput,
): z.infer<typeof createReportBodySchema> {
  const stays = draft.hospitalizations ?? [];
  const documents = flattenDocuments(draft.documentSlots, draft.documentUrls ?? []);

  return createReportBodySchema.parse({
    accidentType: draft.accidentType ?? SUPPORTED_ACCIDENT_TYPE,
    accidentDate: draft.accidentDate,
    diagnosis: (draft.diagnosis ?? []).map((d) => d.trim()).filter(Boolean),
    offeredAmount: draft.insuranceNotOffered ? null : (draft.insuranceOffered ?? null),
    hospitalizations: stays.length
      ? stays.map((s) => ({
          hospitalStart: s.start,
          hospitalEnd: s.end ?? null,
          hospitalReason: s.reason ?? null,
        }))
      : null,
    description: null,
    additionalInformation: serializeAdditionalInformation(draft),
    documents: documents.length ? documents : null,
    question: draft.question?.trim() || null,
  });
}

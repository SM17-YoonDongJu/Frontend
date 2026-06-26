import { z } from "zod";

/**
 * 사고 유형 enum. 단일 진실: API 명세 POST /reports body `accidentType`.
 * 영문값으로 통일하고 한글은 표시 라벨로만 분리한다.
 */
export const accidentTypeSchema = z.enum([
  "medical_indemnity",
  "traffic",
  "disability",
  "cancer_diagnosis",
  "fire",
  "liability",
  "other",
]);

export type AccidentType = z.infer<typeof accidentTypeSchema>;

export const ACCIDENT_TYPE_LABELS: Record<AccidentType, string> = {
  medical_indemnity: "실손 의료비",
  traffic: "교통사고",
  disability: "후유장해",
  cancer_diagnosis: "암·진단비",
  fire: "화재",
  liability: "배상책임",
  other: "기타",
};

/** MVP 분석 가능 유형(그 외는 UNSUPPORTED_OPERATION). */
export const SUPPORTED_ACCIDENT_TYPE: AccidentType = "medical_indemnity";

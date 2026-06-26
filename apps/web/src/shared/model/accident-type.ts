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

// AccidentType 누락 시 컴파일 에러로 잡도록 enum 키 전수 매핑.
const ACCIDENT_TYPE_LABEL_MAP: Record<AccidentType, string> = {
  medical_indemnity: "실손 의료비",
  traffic: "교통사고",
  disability: "후유장해",
  cancer_diagnosis: "암·진단비",
  fire: "화재",
  liability: "배상책임",
  other: "기타",
};

/** 임의 문자열도 받도록 넓힌 라벨 맵(미지의 값은 그대로 노출). */
export const ACCIDENT_TYPE_LABELS: Record<string, string> = ACCIDENT_TYPE_LABEL_MAP;

/** 사고 유형 코드 → 한글 라벨(미지의 값은 원본 반환). */
export function accidentTypeLabel(value: string): string {
  return ACCIDENT_TYPE_LABELS[value] ?? value;
}

/** MVP 분석 가능 유형(그 외는 UNSUPPORTED_OPERATION). */
export const SUPPORTED_ACCIDENT_TYPE: AccidentType = "medical_indemnity";

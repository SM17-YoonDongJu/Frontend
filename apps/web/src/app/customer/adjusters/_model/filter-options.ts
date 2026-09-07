import type { SortKey } from "./types";

/** 전문분야 필터 옵션. 값=쿼리 파라미터(specialty)로 전송되는 표시 라벨. */
export const SPECIALTY_OPTIONS = [
  "전체",
  "후유장해",
  "교통사고",
  "실손 의료비",
  "암·진단비",
  "배상책임",
  "산재 연계",
] as const;

/** 정렬 옵션. label=표시, value=쿼리 파라미터(sort). ※ review 정렬은 UI 미노출(명세 sort enum엔 존재). */
export const SORT_OPTIONS: ReadonlyArray<{ label: string; value: SortKey }> = [
  { label: "평점순", value: "rating" },
  { label: "경력순", value: "career" },
  { label: "상담많은순", value: "consultCount" },
];

/** 모바일 전문분야 필터 칩. label=Figma 모바일 문구(축약 "실손"), value는 위 옵션 값과 동일 어휘. */
export const MOBILE_FILTER_CHIPS: ReadonlyArray<{
  label: string;
  value: (typeof SPECIALTY_OPTIONS)[number];
}> = [
  { label: "후유장해", value: "후유장해" },
  { label: "교통사고", value: "교통사고" },
  { label: "실손", value: "실손 의료비" },
];

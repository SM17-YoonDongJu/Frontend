/** 약관 상세 종류 슬러그(라우트 [type] 값·동의 항목 식별자 겸용). */
export const TERMS_TYPES = ["service", "privacy", "marketing"] as const;

export type TermsType = (typeof TERMS_TYPES)[number];

export function isTermsType(value: string): value is TermsType {
  return (TERMS_TYPES as readonly string[]).includes(value);
}

import type { TermsType } from "@/shared/model/terms-content";

/** 약관 동의 항목 1개 정의. slug=상세 페이지 라우팅(terms/[type]) 겸용. */
export interface ConsentItem {
  type: TermsType;
  /** 항목 본문 라벨(접두 "(필수)/(선택)"·접미 "동의"는 표시부에서 조합) */
  title: string;
  required: boolean;
}

/** 약관 3종 — Figma 순서·문구 기준(서비스/개인정보=필수, 마케팅=선택). */
export const CONSENT_ITEMS: ConsentItem[] = [
  { type: "service", title: "서비스 이용약관", required: true },
  { type: "privacy", title: "개인정보 처리방침", required: true },
  { type: "marketing", title: "마케팅 정보 수신", required: false },
];

export const REQUIRED_CONSENT_TYPES = CONSENT_ITEMS.filter((item) => item.required).map(
  (item) => item.type,
);

/** 약관 항목별 동의 여부 맵. */
export type ConsentState = Record<TermsType, boolean>;

export const EMPTY_CONSENT: ConsentState = {
  service: false,
  privacy: false,
  marketing: false,
};

/** 필수 약관(서비스·개인정보)이 모두 동의됐는지 — "동의하고 가입" 활성 조건. */
export function isRequiredConsentMet(consent: ConsentState): boolean {
  return REQUIRED_CONSENT_TYPES.every((type) => consent[type]);
}

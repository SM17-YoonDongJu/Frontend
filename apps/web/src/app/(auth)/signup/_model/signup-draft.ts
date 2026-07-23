import type { RegionValue } from "@/shared/model/regions";
import type { UserType } from "@/shared/model/user";
import { EMPTY_CONSENT, type ConsentState } from "./consent-config";
import type { Gender } from "./register.schema";

/** 본인 확인 스텝 입력값. 이름·지역은 명세 미확정으로 register 미전송(드래프트 보관만). */
export interface IdentityDraft {
  name: string;
  gender: Gender | null;
  /** YYYY-MM-DD (입력 중엔 부분 문자열 허용) */
  birthDate: string;
  /** 010-0000-0000 하이픈 포함 */
  phoneNumber: string;
  region: RegionValue | null;
}

export const EMPTY_IDENTITY: IdentityDraft = {
  name: "",
  gender: null,
  birthDate: "",
  phoneNumber: "",
  region: null,
};

/** 약관 상세 페이지 왕복(전체 페이지 이동) 간 유지할 퍼널 로컬 상태. */
export interface SignupDraft {
  userType: UserType | null;
  consent: ConsentState;
  identity: IdentityDraft;
}

const STORAGE_KEY = "signup-draft";

const EMPTY_DRAFT: SignupDraft = {
  userType: null,
  consent: EMPTY_CONSENT,
  identity: EMPTY_IDENTITY,
};

export function loadSignupDraft(): SignupDraft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DRAFT;
    const parsed = JSON.parse(raw) as Partial<SignupDraft>;
    return {
      userType: parsed.userType ?? null,
      consent: { ...EMPTY_CONSENT, ...parsed.consent },
      identity: { ...EMPTY_IDENTITY, ...parsed.identity },
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

export function saveSignupDraft(draft: SignupDraft): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearSignupDraft(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

import type { UserType } from "@/shared/model/user";
import { EMPTY_CONSENT, type ConsentState } from "./consent-config";

/** 약관 상세 페이지 왕복(전체 페이지 이동) 간 유지할 퍼널 로컬 상태. */
export interface SignupDraft {
  userType: UserType | null;
  consent: ConsentState;
}

const STORAGE_KEY = "signup-draft";

const EMPTY_DRAFT: SignupDraft = { userType: null, consent: EMPTY_CONSENT };

export function loadSignupDraft(): SignupDraft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DRAFT;
    const parsed = JSON.parse(raw) as Partial<SignupDraft>;
    return {
      userType: parsed.userType ?? null,
      consent: { ...EMPTY_CONSENT, ...parsed.consent },
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

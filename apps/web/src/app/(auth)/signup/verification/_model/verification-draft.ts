import type { AffiliationType, Speciality } from "./adjuster-application.schema";

/**
 * 자격 인증 폼 로컬 draft(sessionStorage).
 * GET .../me는 name·speciality·licenseNo·documents만 반환 → 반려 후 재제출 시
 * 전화·전문분야·경력·소속·활동지역·소개까지 프리필하려면 로컬 draft 병행이 필요(signup-draft 패턴).
 */
export interface VerificationDraft {
  name: string;
  licenseNo: string;
  phone: string;
  email: string;
  speciality: Speciality | "";
  affiliation: AffiliationType | "";
  specialties: string[];
  career: string;
  region: string;
  introduction: string;
  licenseImageUrl: string | null;
  registrationImageUrl: string | null;
  idCardImageUrl: string | null;
}

const STORAGE_KEY = "verification-draft";

const EMPTY_DRAFT: VerificationDraft = {
  name: "",
  licenseNo: "",
  phone: "",
  email: "",
  speciality: "",
  affiliation: "",
  specialties: [],
  career: "",
  region: "",
  introduction: "",
  licenseImageUrl: null,
  registrationImageUrl: null,
  idCardImageUrl: null,
};

export function loadVerificationDraft(): VerificationDraft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DRAFT;
    const parsed = JSON.parse(raw) as Partial<VerificationDraft>;
    return { ...EMPTY_DRAFT, ...parsed };
  } catch {
    return EMPTY_DRAFT;
  }
}

export function saveVerificationDraft(draft: VerificationDraft): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearVerificationDraft(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

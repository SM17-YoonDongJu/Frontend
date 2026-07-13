"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getApplyAdjusterErrorCode,
  useApplyAdjuster,
  type ApplyAdjusterErrorCode,
} from "../_api/use-apply-adjuster";
import type {
  AdjusterApplicationExtendedBody,
  AffiliationType,
  Speciality,
} from "../_model/adjuster-application.schema";
import {
  loadVerificationDraft,
  saveVerificationDraft,
} from "../_model/verification-draft";
import type { VerificationStep } from "./use-verification-funnel";
import { useDocumentUpload, type DocumentUpload } from "./use-document-upload";

const STATUS_PATH = "/signup/verification/status";
const DASHBOARD_PATH = "/customer/dashboard";

export type VerificationFieldError =
  | "name"
  | "phone"
  | "speciality"
  | "affiliation"
  | "region"
  | "license"
  | "registration";

type ErrorMap = Partial<Record<VerificationFieldError, string>>;

const STEP_FIELDS: Record<VerificationStep, VerificationFieldError[]> = {
  basic: ["name", "phone"],
  expertise: ["speciality", "affiliation", "region"],
  documents: ["registration", "license"],
};

export interface VerificationForm {
  name: string;
  setName: (value: string) => void;
  licenseNo: string;
  setLicenseNo: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  speciality: Speciality | null;
  setSpeciality: (value: Speciality) => void;
  affiliation: AffiliationType | null;
  setAffiliation: (value: AffiliationType) => void;
  specialties: string[];
  toggleSpecialty: (value: string) => void;
  career: string;
  setCareer: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
  introduction: string;
  setIntroduction: (value: string) => void;

  documents: Record<"license" | "registration", DocumentUpload>;

  errors: ErrorMap;
  isUploading: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  submitErrorCode: ApplyAdjusterErrorCode | null;

  /** 스텝(모바일 퍼널) 유효성 검사 + 에러 표시. 통과 시 true. */
  validateStep: (step: VerificationStep) => boolean;
  submit: () => void;
  goDashboard: () => void;
  goStatus: () => void;
}

/**
 * 신청 폼 공유 상태 훅. 뷰포트별 노출 필드가 달라(연락처는 모바일 STEP1에만),
 * 데스크톱에선 미노출 필드(phone)를 검증하지 않는다. 제출 로직은 하나로 공유.
 * 서류는 자격증 사본·등록증 2종.
 */
export function useVerificationForm(isDesktop: boolean): VerificationForm {
  const router = useRouter();
  const apply = useApplyAdjuster();

  const license = useDocumentUpload();
  const registration = useDocumentUpload();

  const [name, setName] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [phone, setPhone] = useState("");
  const [speciality, setSpeciality] = useState<Speciality | null>(null);
  const [affiliation, setAffiliation] = useState<AffiliationType | null>(null);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [career, setCareer] = useState("");
  const [region, setRegion] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [errors, setErrors] = useState<ErrorMap>({});

  // 재제출·약관 왕복 대비: 로컬 draft 복원(1회, data-engineer _model 모듈).
  useEffect(() => {
    const draft = loadVerificationDraft();
    if (draft.name) setName(draft.name);
    if (draft.licenseNo) setLicenseNo(draft.licenseNo);
    if (draft.phone) setPhone(draft.phone);
    if (draft.speciality) setSpeciality(draft.speciality);
    if (draft.affiliation) setAffiliation(draft.affiliation);
    if (draft.specialties.length > 0) setSpecialties(draft.specialties);
    if (draft.career) setCareer(draft.career);
    if (draft.region) setRegion(draft.region);
    if (draft.introduction) setIntroduction(draft.introduction);
    if (draft.licenseImageUrl) license.restore(draft.licenseImageUrl);
    if (draft.registrationImageUrl) registration.restore(draft.registrationImageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 입력 변경 시 draft 저장(파일은 업로드 URL만 유지).
  useEffect(() => {
    saveVerificationDraft({
      name,
      licenseNo,
      phone,
      speciality: speciality ?? "",
      affiliation: affiliation ?? "",
      specialties,
      career,
      region,
      introduction,
      licenseImageUrl: license.url ?? null,
      registrationImageUrl: registration.url ?? null,
    });
  }, [
    name,
    licenseNo,
    phone,
    speciality,
    affiliation,
    specialties,
    career,
    region,
    introduction,
    license.url,
    registration.url,
  ]);

  const toggleSpecialty = (value: string) => {
    setSpecialties((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const isUploading =
    license.status === "uploading" || registration.status === "uploading";

  const licenseSatisfied = Boolean(licenseNo.trim()) || Boolean(license.url);

  // 연락처는 모바일 STEP1에만 노출 → 데스크톱에선 필수 아님.
  const contactValid = isDesktop || Boolean(phone.trim());

  const requiredValid = useMemo(
    () =>
      Boolean(name.trim()) &&
      contactValid &&
      speciality !== null &&
      affiliation !== null &&
      Boolean(region.trim()) &&
      licenseSatisfied &&
      Boolean(registration.url),
    [name, contactValid, speciality, affiliation, region, licenseSatisfied, registration.url],
  );

  const collectErrors = (step?: VerificationStep): ErrorMap => {
    const next: ErrorMap = {};
    const wants = (s: VerificationStep) => step === undefined || step === s;

    if (wants("basic")) {
      if (!name.trim()) next.name = "이름을 입력해 주세요.";
      // 연락처는 모바일 STEP1 전용 검증(데스크톱 미노출 → 스킵).
      if (!isDesktop && !phone.trim()) next.phone = "연락처를 입력해 주세요.";
    }
    if (wants("expertise")) {
      if (speciality === null) next.speciality = "자격 구분을 선택해 주세요.";
      if (affiliation === null) next.affiliation = "소속을 선택해 주세요.";
      if (!region.trim()) next.region = "활동 지역을 입력해 주세요.";
    }
    if (wants("documents")) {
      if (!registration.url) next.registration = "등록증을 올려 주세요.";
      if (!licenseSatisfied) next.license = "자격증 번호 또는 사본 중 하나는 필수예요.";
    }
    return next;
  };

  const validateStep = (step: VerificationStep): boolean => {
    const stepErrors = collectErrors(step);
    setErrors((prev) => {
      const next = { ...prev };
      for (const field of STEP_FIELDS[step]) delete next[field];
      return { ...next, ...stepErrors };
    });
    return Object.keys(stepErrors).length === 0;
  };

  const submit = () => {
    const allErrors = collectErrors();
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0 || isUploading || apply.isPending) return;

    // phone·specialties는 명세 미정의 확장 필드(백엔드 정의 요청 중). 데스크톱에선 빈 값.
    const body: AdjusterApplicationExtendedBody = {
      name: name.trim(),
      speciality: speciality as Speciality,
      licenseNo: licenseNo.trim() || null,
      licenseImageUrl: license.url ?? null,
      career: career ? Number(career.replace(/\D/g, "")) || null : null,
      introduction: introduction.trim() || null,
      affiliation: affiliation as AffiliationType,
      region: region.trim(),
      registrationImageUrl: registration.url as string,
      phone: phone.trim(),
      specialties,
    };

    // N6: 제출 성공해도 draft 유지(같은 세션 반려→재제출 프리필). clear는 APPROVED에서만.
    apply.mutate(body, {
      onSuccess: () => router.replace(STATUS_PATH),
    });
  };

  return {
    name,
    setName,
    licenseNo,
    setLicenseNo,
    phone,
    setPhone,
    speciality,
    setSpeciality,
    affiliation,
    setAffiliation,
    specialties,
    toggleSpecialty,
    career,
    setCareer,
    region,
    setRegion,
    introduction,
    setIntroduction,
    documents: { license, registration },
    errors,
    isUploading,
    isSubmitting: apply.isPending,
    canSubmit: requiredValid && !isUploading && !apply.isPending,
    submitErrorCode: getApplyAdjusterErrorCode(apply.error),
    validateStep,
    submit,
    goDashboard: () => router.push(DASHBOARD_PATH),
    goStatus: () => router.push(STATUS_PATH),
  };
}

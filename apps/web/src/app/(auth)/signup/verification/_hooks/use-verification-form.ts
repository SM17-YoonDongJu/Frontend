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
  | "email"
  | "speciality"
  | "affiliation"
  | "region"
  | "license"
  | "registration"
  | "idCard";

type ErrorMap = Partial<Record<VerificationFieldError, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface VerificationForm {
  name: string;
  setName: (value: string) => void;
  licenseNo: string;
  setLicenseNo: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
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

  documents: Record<"license" | "registration" | "idCard", DocumentUpload>;

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

export function useVerificationForm(): VerificationForm {
  const router = useRouter();
  const apply = useApplyAdjuster();

  const license = useDocumentUpload();
  const registration = useDocumentUpload();
  const idCard = useDocumentUpload();

  const [name, setName] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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
    if (draft.email) setEmail(draft.email);
    if (draft.speciality) setSpeciality(draft.speciality);
    if (draft.affiliation) setAffiliation(draft.affiliation);
    if (draft.specialties.length > 0) setSpecialties(draft.specialties);
    if (draft.career) setCareer(draft.career);
    if (draft.region) setRegion(draft.region);
    if (draft.introduction) setIntroduction(draft.introduction);
    if (draft.licenseImageUrl) license.restore(draft.licenseImageUrl);
    if (draft.registrationImageUrl) registration.restore(draft.registrationImageUrl);
    if (draft.idCardImageUrl) idCard.restore(draft.idCardImageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 입력 변경 시 draft 저장(파일은 업로드 URL만 유지).
  useEffect(() => {
    saveVerificationDraft({
      name,
      licenseNo,
      phone,
      email,
      speciality: speciality ?? "",
      affiliation: affiliation ?? "",
      specialties,
      career,
      region,
      introduction,
      licenseImageUrl: license.url ?? null,
      registrationImageUrl: registration.url ?? null,
      idCardImageUrl: idCard.url ?? null,
    });
  }, [
    name,
    licenseNo,
    phone,
    email,
    speciality,
    affiliation,
    specialties,
    career,
    region,
    introduction,
    license.url,
    registration.url,
    idCard.url,
  ]);

  const toggleSpecialty = (value: string) => {
    setSpecialties((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const isUploading =
    license.status === "uploading" ||
    registration.status === "uploading" ||
    idCard.status === "uploading";

  const licenseSatisfied = Boolean(licenseNo.trim()) || Boolean(license.url);

  const requiredValid = useMemo(
    () =>
      Boolean(name.trim()) &&
      Boolean(phone.trim()) &&
      EMAIL_PATTERN.test(email.trim()) &&
      speciality !== null &&
      affiliation !== null &&
      Boolean(region.trim()) &&
      licenseSatisfied &&
      Boolean(registration.url) &&
      Boolean(idCard.url),
    [name, phone, email, speciality, affiliation, region, licenseSatisfied, registration.url, idCard.url],
  );

  const collectErrors = (step?: VerificationStep): ErrorMap => {
    const next: ErrorMap = {};
    const wants = (s: VerificationStep) => step === undefined || step === s;

    if (wants("basic")) {
      if (!name.trim()) next.name = "이름을 입력해 주세요.";
      if (!phone.trim()) next.phone = "연락처를 입력해 주세요.";
      if (!EMAIL_PATTERN.test(email.trim())) next.email = "올바른 이메일을 입력해 주세요.";
    }
    if (wants("expertise")) {
      if (speciality === null) next.speciality = "자격 구분을 선택해 주세요.";
      if (affiliation === null) next.affiliation = "소속을 선택해 주세요.";
      if (!region.trim()) next.region = "활동 지역을 입력해 주세요.";
    }
    if (wants("documents")) {
      if (!registration.url) next.registration = "등록증을 올려 주세요.";
      if (!idCard.url) next.idCard = "신분증을 올려 주세요.";
      if (!licenseSatisfied) next.license = "자격증 번호 또는 사본 중 하나는 필수예요.";
    }
    return next;
  };

  const validateStep = (step: VerificationStep): boolean => {
    const stepErrors = collectErrors(step);
    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const submit = () => {
    const allErrors = collectErrors();
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0 || isUploading || apply.isPending) return;

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
      idCardImageUrl: idCard.url as string,
      phone: phone.trim(),
      email: email.trim(),
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
    email,
    setEmail,
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
    documents: { license, registration, idCard },
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

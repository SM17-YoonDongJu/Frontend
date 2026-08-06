"use client";

import { useState } from "react";
import { RegionSelect } from "@/shared/ui/RegionSelect/RegionSelect";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import type { RegisterErrorCode } from "../_api/use-register";
import type { IdentityDraft } from "../_model/signup-draft";
import { ChoiceChips, type ChoiceOption } from "../_shared/ui/ChoiceChips";

interface IdentityStepProps {
  identity: IdentityDraft;
  onChange: (identity: IdentityDraft) => void;
  onSubmit: () => void;
  loading: boolean;
  errorCode: RegisterErrorCode | null;
}

type IdentityField = "name" | "gender" | "birthDate" | "phoneNumber" | "region";

type IdentityErrors = Partial<Record<IdentityField, string>>;

const GENDER_OPTIONS: ChoiceOption<"F" | "M">[] = [
  { value: "F", label: "여성" },
  { value: "M", label: "남성" },
];

const REGISTER_ERROR_MESSAGE: Record<RegisterErrorCode, string> = {
  DUPLICATE_RESOURCE: "이미 가입된 계정이에요. 로그인으로 진행해 주세요.",
  VALIDATION_ERROR: "입력한 정보를 다시 확인해 주세요.",
  MISSING_REQUIRED_FIELD: "필수 정보가 누락됐어요. 다시 시도해 주세요.",
  EXTERNAL_API_ERROR: "소셜 인증에 실패했어요. 잠시 후 다시 시도해 주세요.",
};

/** 숫자만 남겨 YYYY-MM-DD로 하이픈 자동 삽입. */
function formatBirthDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

/** 숫자만 남겨 010-0000-0000 형태로 하이픈 자동 삽입. */
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`;
}

function isValidBirthDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year = 0, month = 0, day = 0] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    year >= 1900 &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getTime() <= Date.now()
  );
}

function validate(identity: IdentityDraft): IdentityErrors {
  const errors: IdentityErrors = {};
  if (!identity.name.trim()) errors.name = "이름을 입력해 주세요.";
  if (!identity.gender) errors.gender = "성별을 선택해 주세요.";
  if (!identity.birthDate) errors.birthDate = "생년월일을 입력해 주세요.";
  else if (!isValidBirthDate(identity.birthDate))
    errors.birthDate = "생년월일 8자리를 정확히 입력해 주세요.";
  if (!identity.phoneNumber) errors.phoneNumber = "휴대폰 번호를 입력해 주세요.";
  else if (!/^01\d-\d{3,4}-\d{4}$/.test(identity.phoneNumber))
    errors.phoneNumber = "올바른 휴대폰 번호를 입력해 주세요.";
  if (!identity.region) errors.region = "지역을 선택해 주세요.";
  return errors;
}

/** Step3: 본인 확인 — 이름·성별·생년월일·휴대폰 번호·지역 수집 후 가입 요청. */
export function IdentityStep({ identity, onChange, onSubmit, loading, errorCode }: IdentityStepProps) {
  const [errors, setErrors] = useState<IdentityErrors>({});

  const update = (field: IdentityField, value: IdentityDraft[IdentityField]) => {
    onChange({ ...identity, [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleNext = () => {
    const next = validate(identity);
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit();
  };

  return (
    <div>
      <h1 className="font-serif text-[1.5rem] font-bold text-ink">본인 확인을 해주세요</h1>
      <p className="mt-2 text-sm text-ink-3">이름과 휴대폰 번호로 본인 인증을 진행합니다.</p>

      <div className="mt-6 flex flex-col gap-[1.125rem]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="identity-name">이름</Label>
          <Input
            id="identity-name"
            value={identity.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="홍길동"
            autoComplete="name"
            error={errors.name}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>성별</Label>
          <ChoiceChips
            aria-label="성별"
            options={GENDER_OPTIONS}
            value={identity.gender}
            onChange={(value) => update("gender", value)}
          />
          {errors.gender && (
            <span className="text-[0.75rem] font-medium text-terra">{errors.gender}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="identity-birth-date">생년월일</Label>
          <Input
            id="identity-birth-date"
            inputMode="numeric"
            value={identity.birthDate}
            onChange={(event) => update("birthDate", formatBirthDate(event.target.value))}
            placeholder="1990-01-01"
            autoComplete="bday"
            error={errors.birthDate}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="identity-phone">휴대폰 번호</Label>
          <Input
            id="identity-phone"
            type="tel"
            inputMode="numeric"
            value={identity.phoneNumber}
            onChange={(event) => update("phoneNumber", formatPhoneNumber(event.target.value))}
            placeholder="010-0000-0000"
            autoComplete="tel"
            error={errors.phoneNumber}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>지역</Label>
          <RegionSelect
            className="w-full"
            value={identity.region}
            onChange={(value) => update("region", value)}
            placeholder="거주 지역을 선택해 주세요"
            error={errors.region}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2.5 rounded-[0.875rem] bg-gold-soft px-[1.125rem] py-3.5">
        <ShieldCheck className="shrink-0 text-[1.125rem] text-gold-ink" />
        <p className="break-keep text-[0.8125rem] leading-relaxed text-gold-ink">
          본인 인증 정보는 가입 확인 외에는 저장되지 않아요.
        </p>
      </div>

      {errorCode && (
        <p
          role="alert"
          className="mt-5 rounded-input bg-terra-soft px-4 py-3 text-[0.8125rem] font-medium text-terra"
        >
          {REGISTER_ERROR_MESSAGE[errorCode]}
        </p>
      )}

      <Button
        full
        size="lg"
        className="mt-6"
        loading={loading}
        onClick={handleNext}
        icon={<ArrowRight className="text-[1.1rem]" />}
      >
        다음
      </Button>
    </div>
  );
}

"use client";

import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Textarea } from "@/shared/ui/Textarea";
import type { AffiliationType, Speciality } from "../_model/adjuster-application.schema";
import type { VerificationForm } from "../_hooks/use-verification-form";
import { ChoiceChips, type ChoiceOption } from "./ChoiceChips";
import { SpecialtyChips } from "./SpecialtyChips";

const SPECIALITY_OPTIONS: ChoiceOption<Speciality>[] = [
  { value: "신체", label: "신체손해사정사" },
  { value: "종합", label: "종합손해사정사 (신체 포함)" },
];

const AFFILIATION_OPTIONS: ChoiceOption<AffiliationType>[] = [
  { value: "INDEPENDENT", label: "독립 (개업)" },
  { value: "FIRM", label: "손해사정법인 소속" },
];

const INTRODUCTION_MAX = 200;

interface ExpertiseFieldsProps {
  form: VerificationForm;
  /** 모바일 퍼널: 텍스트 인풋을 placeholder-only로(칩·선택 라벨은 유지). */
  hideLabels?: boolean;
}

/** 전문성 필드(자격구분·소속·전문분야·경력·활동지역·소개). */
export function ExpertiseFields({ form, hideLabels }: ExpertiseFieldsProps) {
  const inputLabelClass = hideLabels ? "sr-only" : undefined;

  return (
    <div className="flex flex-col gap-[1.125rem]">
      <div className="flex flex-col gap-2">
        <Label>자격 구분</Label>
        <ChoiceChips
          aria-label="자격 구분"
          options={SPECIALITY_OPTIONS}
          value={form.speciality}
          onChange={form.setSpeciality}
        />
        {form.errors.speciality && (
          <span className="text-[0.75rem] font-medium text-terra">{form.errors.speciality}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>소속</Label>
        <ChoiceChips
          aria-label="소속"
          options={AFFILIATION_OPTIONS}
          value={form.affiliation}
          onChange={form.setAffiliation}
        />
        {form.errors.affiliation && (
          <span className="text-[0.75rem] font-medium text-terra">{form.errors.affiliation}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>
          전문 분야 <span className="font-normal text-ink-3">(중복 선택)</span>
        </Label>
        <SpecialtyChips
          aria-label="전문 분야"
          value={form.specialties}
          onToggle={form.toggleSpecialty}
        />
      </div>

      <div className="grid grid-cols-1 gap-[1.125rem] md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="verification-career" className={inputLabelClass}>
            경력 연차
          </Label>
          <Input
            id="verification-career"
            inputMode="numeric"
            value={form.career}
            onChange={(event) => form.setCareer(event.target.value.replace(/\D/g, ""))}
            placeholder={hideLabels ? "경력 연차" : "12"}
            suffix="년"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="verification-region" className={inputLabelClass}>
            활동 지역
          </Label>
          <Input
            id="verification-region"
            value={form.region}
            onChange={(event) => form.setRegion(event.target.value)}
            placeholder={hideLabels ? "활동 지역" : "서울 · 경기"}
            error={form.errors.region}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="verification-introduction" className={inputLabelClass}>
          한 줄 소개
        </Label>
        <Textarea
          id="verification-introduction"
          value={form.introduction}
          onChange={form.setIntroduction}
          rows={3}
          maxLength={INTRODUCTION_MAX}
          placeholder="예) 후유장해 등급 재산정 전문"
        />
      </div>
    </div>
  );
}

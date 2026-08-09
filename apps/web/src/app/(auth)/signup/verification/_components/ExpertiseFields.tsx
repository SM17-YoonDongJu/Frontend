"use client";

import { formatRegionList, parseRegionList } from "@/shared/model/regions";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { RegionSelect } from "@/shared/ui/RegionSelect/RegionSelect";
import { Textarea } from "@/shared/ui/Textarea";
import type { AffiliationType, Speciality } from "../_model/adjuster-application.schema";
import type { VerificationForm } from "../_hooks/use-verification-form";
import { ChoiceChips, type ChoiceOption } from "../../_shared/ui/ChoiceChips";
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
  /** 한 줄 소개 노출 여부. 모바일 STEP2=true, 데스크톱 폼(131-10583 부재)=false. */
  showProfileExtras?: boolean;
}

/** 전문성 필드(자격구분·소속[·전문분야]·경력·활동지역[·소개]). */
export function ExpertiseFields({ form, showProfileExtras = true }: ExpertiseFieldsProps) {

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

      {/* 전송 필드(BE specialties, 최소 1개)라 데스크톱 폼에도 항상 노출. */}
      <div className="flex flex-col gap-2">
        <Label>
          전문 분야 <span className="font-normal text-ink-3">(중복 선택)</span>
        </Label>
        <SpecialtyChips
          aria-label="전문 분야"
          value={form.specialties}
          onToggle={form.toggleSpecialty}
        />
        {form.errors.specialties && (
          <span className="text-[0.75rem] font-medium text-terra">{form.errors.specialties}</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-[1.125rem] md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="verification-career">
            경력 연차
          </Label>
          <Input
            id="verification-career"
            inputMode="numeric"
            value={form.career}
            onChange={(event) => form.setCareer(event.target.value.replace(/\D/g, ""))}
            placeholder="12"
            suffix="년"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>활동 지역</Label>
          <RegionSelect
            mode="multiple"
            value={parseRegionList(form.region)}
            onChange={(regions) => form.setRegion(formatRegionList(regions))}
            error={form.errors.region}
            className="self-start"
          />
        </div>
      </div>

      {showProfileExtras && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="verification-introduction">
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
      )}
    </div>
  );
}

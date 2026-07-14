"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { formatRegionList, parseRegionList } from "@/shared/model/regions";
import { Input } from "@/shared/ui/Input";
import { RegionSelect } from "@/shared/ui/RegionSelect/RegionSelect";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { HEADLINE_MAX, INTRODUCTION_MAX } from "../_model/specialty-options";
import type { ProfileFormValues } from "../_model/types";
import { AvatarUploader } from "./AvatarUploader";

interface BasicInfoSectionProps {
  register: UseFormRegister<ProfileFormValues>;
  control: Control<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  nickname: string;
  registrationNo?: string | null;
  headlineLength: number;
  introductionLength: number;
  onUploadingChange?: (uploading: boolean) => void;
}

function FieldLabel({
  children,
  counter,
}: {
  children: React.ReactNode;
  counter?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-[0.8125rem] font-semibold text-ink-2">{children}</span>
      {counter && <span className="hidden text-[0.75rem] text-ink-3 lg:inline">{counter}</span>}
    </div>
  );
}

export function BasicInfoSection({
  register,
  control,
  errors,
  nickname,
  registrationNo,
  headlineLength,
  introductionLength,
  onUploadingChange,
}: BasicInfoSectionProps) {
  return (
    <section className="space-y-5 lg:rounded-card-lg lg:border lg:border-line lg:bg-card lg:p-6">
      <h2 className="hidden font-serif text-[1.125rem] font-bold text-ink lg:block">기본 정보</h2>

      <Controller
        control={control}
        name="avatarUrl"
        render={({ field }) => (
          <AvatarUploader
            value={field.value}
            nickname={nickname}
            onChange={(url) => field.onChange(url)}
            onUploadingChange={onUploadingChange}
          />
        )}
      />

      <div className="flex justify-center lg:hidden">
        <span className="inline-flex items-center gap-1.5 rounded-chip bg-green-soft px-2.5 py-1 text-[0.75rem] font-bold text-green">
          <ShieldCheck className="text-[0.8125rem]" />
          자격 인증 완료{registrationNo ? ` · 등록번호 ${registrationNo}` : ""}
        </span>
      </div>

      <div>
        <FieldLabel counter={`${headlineLength}/${HEADLINE_MAX}`}>한 줄 소개 (태그라인)</FieldLabel>
        <Input
          placeholder="예) 후유장해 재산정 전문 · 근거 중심 검토"
          maxLength={HEADLINE_MAX}
          error={errors.headline?.message}
          hint='검색 카드에 바로 노출돼요. 단정적 보상 표현("증액", "100%")은 심사에서 반려될 수 있어요.'
          {...register("headline")}
        />
      </div>

      <div>
        <FieldLabel counter={`${introductionLength}/${INTRODUCTION_MAX}`}>소개</FieldLabel>
        <Input
          multiline
          rows={5}
          placeholder="활동 이력과 검토 방식을 소개해 주세요."
          maxLength={INTRODUCTION_MAX}
          error={errors.introduction?.message}
          {...register("introduction")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>경력</FieldLabel>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="예) 12"
            suffix="년"
            error={errors.career?.message}
            {...register("career")}
          />
        </div>
        <div>
          <FieldLabel>활동 지역</FieldLabel>
          <Controller
            control={control}
            name="activityRegion"
            render={({ field }) => (
              <RegionSelect
                mode="multiple"
                value={parseRegionList(field.value)}
                onChange={(regions) => field.onChange(formatRegionList(regions))}
                error={errors.activityRegion?.message}
                className="w-full"
              />
            )}
          />
        </div>
      </div>
    </section>
  );
}

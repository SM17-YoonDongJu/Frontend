"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { Input } from "@/shared/ui/Input";
import { HEADLINE_MAX, INTRODUCTION_MAX } from "../_model/specialty-options";
import type { ProfileFormValues } from "../_model/types";
import { AvatarUploader } from "./AvatarUploader";

interface BasicInfoSectionProps {
  register: UseFormRegister<ProfileFormValues>;
  control: Control<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  nickname: string;
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
      {counter && <span className="text-[0.75rem] text-ink-3">{counter}</span>}
    </div>
  );
}

export function BasicInfoSection({
  register,
  control,
  errors,
  nickname,
  headlineLength,
  introductionLength,
  onUploadingChange,
}: BasicInfoSectionProps) {
  return (
    <section className="space-y-5 rounded-card-lg border border-line bg-card p-6">
      <h2 className="font-serif text-[1.125rem] font-bold text-ink">기본 정보</h2>

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <Input
            placeholder="예) 서울 · 경기"
            error={errors.activityRegion?.message}
            {...register("activityRegion")}
          />
        </div>
      </div>
    </section>
  );
}

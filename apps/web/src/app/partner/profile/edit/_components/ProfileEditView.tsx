"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/shared/ui/Button";
import { useProfile } from "../_api/use-profile";
import { useUpdateProfile } from "../_api/use-update-profile";
import { profileFormSchema, updateProfileBodySchema } from "../_model/adjuster-profile.schema";
import type { AdjusterProfile, ProfileFormValues, UpdateProfileBody } from "../_model/types";
import { BasicInfoSection } from "./BasicInfoSection";
import { CareerSection } from "./CareerSection";
import { PreviewCard } from "./PreviewCard";
import { SpecialtySection } from "./SpecialtySection";

function toFormValues(profile: AdjusterProfile): ProfileFormValues {
  return {
    headline: profile.headline,
    introduction: profile.introduction,
    career: profile.career,
    activityRegion: profile.activityRegion,
    avatarUrl: profile.avatarUrl,
    specialties: profile.specialties,
    careers: profile.careers,
  };
}

function pickDirty(
  values: ProfileFormValues,
  dirtyFields: Partial<Record<keyof ProfileFormValues, unknown>>,
): UpdateProfileBody {
  const patch: Partial<ProfileFormValues> = {};
  (Object.keys(dirtyFields) as (keyof ProfileFormValues)[]).forEach((key) => {
    // 배열(specialties·careers)은 일부 요소만 dirty여도 전체를 전송해야 일관됨.
    (patch as Record<string, unknown>)[key] = values[key];
  });
  return updateProfileBodySchema.parse(patch);
}

export function ProfileEditView() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema) as Resolver<ProfileFormValues>,
    defaultValues: toFormValues(profile),
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
    setValue,
    reset,
  } = form;

  const values = watch();

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmitError(null);
    setSaved(false);
    try {
      const patch = pickDirty(formValues, dirtyFields);
      const updated = await updateProfile.mutateAsync(patch);
      reset(toFormValues(updated));
      setSaved(true);
    } catch {
      setSubmitError("저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  });

  const isSaveDisabled = isSubmitting || isUploading || !isDirty;

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[1.75rem] font-bold text-ink">프로필 수정</h1>
          <p className="mt-1.5 text-[0.875rem] text-ink-3">
            고객에게 보이는 공개 프로필이에요. 저장하면 바로 반영돼요.
          </p>
        </div>
        <Button type="submit" loading={isSubmitting} disabled={isSaveDisabled}>
          저장하기
        </Button>
      </div>

      <div className="mt-6 grid gap-7 lg:grid-cols-[40.75rem_21.25rem]">
        <div className="space-y-6">
          <BasicInfoSection
            register={register}
            control={control}
            errors={errors}
            nickname={profile.nickname}
            headlineLength={values.headline?.length ?? 0}
            introductionLength={values.introduction?.length ?? 0}
            onUploadingChange={setIsUploading}
          />

          <SpecialtySection
            value={values.specialties ?? []}
            onChange={(next) => setValue("specialties", next, { shouldDirty: true, shouldValidate: true })}
            error={errors.specialties?.message}
          />

          <CareerSection control={control} register={register} errors={errors} />

          {(submitError || saved) && (
            <p
              role="status"
              className={
                submitError
                  ? "text-[0.875rem] font-medium text-terra"
                  : "text-[0.875rem] font-medium text-green"
              }
            >
              {submitError ?? "프로필을 저장했어요."}
            </p>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <PreviewCard
            nickname={profile.nickname}
            headline={values.headline ?? ""}
            specialties={values.specialties ?? []}
            career={Number(values.career) || 0}
            activityRegion={values.activityRegion ?? ""}
            avatarUrl={values.avatarUrl ?? null}
          />
        </aside>
      </div>
    </form>
  );
}

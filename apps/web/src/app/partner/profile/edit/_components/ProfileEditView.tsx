"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/shared/ui/Button";
import { Check } from "@/shared/ui/icons/Check";
import { useProfile } from "../_api/use-profile";
import { useUpdateProfile } from "../_api/use-update-profile";
import { profileFormSchema, updateProfileBodySchema } from "../_model/adjuster-profile.schema";
import type { AdjusterProfile, ProfileFormValues, UpdateProfileBody } from "../_model/types";
import { BasicInfoSection } from "./BasicInfoSection";
import { CareerSection } from "./CareerSection";
import { PreviewCard } from "./PreviewCard";
import { ProfileEditAppBar } from "./ProfileEditAppBar";
import { SpecialtySection } from "./SpecialtySection";

function toFormValues(profile: AdjusterProfile): ProfileFormValues {
  return {
    headline: profile.headline,
    introduction: profile.introduction,
    career: profile.career,
    activityRegion: profile.activityRegion,
    avatarUrl: profile.avatarUrl,
    specialties: profile.specialties,
    careers: profile.careers
  };
}

function pickDirty(
  values: ProfileFormValues,
  dirtyFields: Partial<Record<keyof ProfileFormValues, unknown>>
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
    defaultValues: toFormValues(profile)
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
    setValue,
    reset
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
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-6xl">
      <ProfileEditAppBar />

      <div className="px-5 pb-28 lg:px-6 lg:py-8 lg:pb-8">
        <div className="hidden items-start justify-between gap-4 lg:flex">
          <div>
            <nav className="mb-1.5 flex items-center gap-1 text-[0.8125rem] text-ink-3">
              <span>내 정보</span>
              <span aria-hidden>›</span>
              <span className="font-medium text-ink-2">프로필 수정</span>
            </nav>
            <h1 className="font-serif text-[1.75rem] font-bold text-ink">프로필 수정</h1>
            <p className="mt-1.5 text-[0.875rem] text-ink-3">
              고객에게 보이는 공개 프로필이에요. 저장하면 바로 반영돼요.
            </p>
          </div>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSaveDisabled}
            icon={
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="m5 13 4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          >
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
              registrationNo={profile.registrationNo}
              headlineLength={values.headline?.length ?? 0}
              introductionLength={values.introduction?.length ?? 0}
              onUploadingChange={setIsUploading}
            />

            <SpecialtySection
              value={values.specialties ?? []}
              onChange={(next) =>
                setValue("specialties", next, { shouldDirty: true, shouldValidate: true })
              }
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

          <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
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
      </div>

      <div className="sticky bottom-0 z-10 border-t border-line-2 bg-paper px-5 py-3 lg:hidden">
        <Button
          type="submit"
          full
          size="lg"
          loading={isSubmitting}
          disabled={isSaveDisabled}
          icon={<Check className="text-[1.1875rem]" />}
        >
          공개 프로필 저장
        </Button>
      </div>
    </form>
  );
}

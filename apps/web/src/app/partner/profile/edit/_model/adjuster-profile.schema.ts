import { z } from "zod";
import { HEADLINE_MAX, INTRODUCTION_MAX, MAX_SPECIALTIES } from "./specialty-options";
import type { UpdateAdjusterProfileRequest } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

// 응답 스키마는 홈 헤더와 공유 — @/app/partner/_shared/model/adjuster-profile.schema
export const careerItemSchema = z.object({
  period: z.string().min(1),
  company: z.string().min(1),
});

export const profileFormSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(1, "태그라인을 입력해 주세요.")
    .max(HEADLINE_MAX, `${HEADLINE_MAX}자 이내로 입력해 주세요.`),
  introduction: z
    .string()
    .trim()
    .min(1, "소개를 입력해 주세요.")
    .max(INTRODUCTION_MAX, `${INTRODUCTION_MAX}자 이내로 입력해 주세요.`),
  career: z.coerce
    .number({ error: "숫자를 입력해 주세요." })
    .int()
    .min(0, "0 이상으로 입력해 주세요."),
  activityRegion: z.string().trim().min(1, "활동 지역을 선택해 주세요."),
  avatarUrl: z.string().url().nullable(),
  specialties: z
    .array(z.string())
    .min(1, "전문분야를 1개 이상 선택해 주세요.")
    .max(MAX_SPECIALTIES, `최대 ${MAX_SPECIALTIES}개까지 선택할 수 있습니다.`),
  careers: z.array(careerItemSchema),
});

export const updateProfileBodySchema = profileFormSchema.partial();

type _UpdateProfileBodyDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.infer<typeof updateProfileBodySchema>, UpdateAdjusterProfileRequest>
>;

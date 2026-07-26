import { z } from "zod";
import { HEADLINE_MAX, INTRODUCTION_MAX, MAX_SPECIALTIES } from "./specialty-options";

export const careerItemSchema = z.object({
  period: z.string().min(1),
  company: z.string().min(1),
});

// 실응답은 미작성 프로필에서 기간·회사가 null로 올 수 있음(폼 검증은 careerItemSchema 유지).
export const careerItemResponseSchema = z.object({
  period: z.string().nullable(),
  company: z.string().nullable(),
});

export const adjusterProfileSchema = z.object({
  adjusterId: z.string().uuid(),
  nickname: z.string(),
  headline: z.string().nullable(),
  introduction: z.string().nullable(),
  career: z.number().int().nonnegative().nullable(),
  activityRegion: z.string(),
  avatarUrl: z.string().url().nullable(),
  specialties: z.array(z.string()),
  careers: z.array(careerItemResponseSchema),
  // 실 API 미정 필드(MSW 선제공) — 명세 확정 시 필수로 승격
  registrationNo: z.string().nullish(),
  updatedAt: z.string().nullable(),
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

export const uploadAvatarResponseSchema = z.object({ url: z.string().url() });

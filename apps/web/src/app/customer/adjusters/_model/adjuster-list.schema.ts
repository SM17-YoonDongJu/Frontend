import { z } from "zod";

/** 손해사정사 목록. 출처: API 명세 GET /adjusters. 필드명 명세 그대로. fetchJson이 봉투를 벗기므로 data 내부만 모델링. */

export const adjusterListItemSchema = z.object({
  adjusterId: z.uuid(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  verified: z.boolean(),
  specialties: z.array(z.string()),
  headline: z.string(),
  averageRating: z.number(),
  reviewCount: z.number().int(),
  career: z.number().int(),
  completedConsultCount: z.number().int(),
  activityRegion: z.string(),
});

export const adjusterListPaginationSchema = z.object({
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  hasNext: z.boolean(),
});

export const adjusterListMetaSchema = z.object({
  totalAdjusterCount: z.number().int(),
  averageRating: z.number(),
  totalConsultCount: z.number().int(),
  averageCareer: z.number(),
});

export const adjusterListSchema = z.object({
  list: z.array(adjusterListItemSchema),
  pagination: adjusterListPaginationSchema,
  meta: adjusterListMetaSchema,
});

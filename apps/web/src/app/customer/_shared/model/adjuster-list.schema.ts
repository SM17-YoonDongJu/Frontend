import { z } from "zod";
import type { AdjusterListResponse, Meta } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

/**
 * 손해사정사 목록 정본 — 목록 화면(adjusters) + 홈 추천(dashboard 온보딩·추천 카드, 이슈 #142) 공유.
 * 출처: API 명세 GET /adjusters. 필드명 명세 그대로. client가 응답 래퍼를 벗기므로 data 내부만 모델링.
 */

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

export type AdjusterList = z.infer<typeof adjusterListSchema>;
export type AdjusterListItem = z.infer<typeof adjusterListItemSchema>;
export type AdjusterListPagination = z.infer<typeof adjusterListPaginationSchema>;
export type AdjusterListMeta = z.infer<typeof adjusterListMetaSchema>;

// list 배열 원소는 명세 스펙 자체가 Item(알림과 동명 재사용 — 스펙 결함 추정)으로 나와 있어 항목별 대조 불가.
// list/pagination/meta 키 존재와 meta 내부 필드만 대조한다.
type _AdjusterListDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<Omit<AdjusterList, "list">, AdjusterListResponse>
>;
type _AdjusterListMetaDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<AdjusterListMeta, Meta>
>;

import { z } from "zod";

/**
 * PC 프리뷰 패널용 AI 초안 요약. 출처: API 명세 GET /reports/{reportId}(검수 대기 상세 조회)의
 * 부분 미러 — 패널 표시 필드만 모델링(zod가 나머지 키는 무시).
 */
export const draftPreviewSchema = z.object({
  claimedMinAmount: z.number().int(),
  claimedMaxAmount: z.number().int(),
  offeredAmount: z.number().int().nullable(),
  omittedSpecialContract: z.array(z.string()),
  issue: z.array(
    z.object({
      title: z.string(),
      tag: z.string().nullable().optional(),
    }),
  ),
});

export type DraftPreview = z.infer<typeof draftPreviewSchema>;

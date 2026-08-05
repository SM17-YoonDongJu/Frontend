import { z } from "zod";
import type { CustomerReportDetailResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

/**
 * PC 프리뷰 패널용 AI 초안 요약. 출처: API 명세 GET /reports/{reportId}(백엔드 CustomerReportDetailResponse)의
 * 부분 미러 — 패널 표시 필드만 모델링(zod가 나머지 키는 무시). 백엔드 필드는 issue(단수) — 소비처(issues) 무변경을
 * 위해 파싱 시 별칭을 추가한다. claimedMin/MaxAmount는 청구액 미산정 리포트에서 null 가능.
 */
const rawDraftPreviewSchema = z.object({
  claimedMinAmount: z.number().int().nullable(),
  claimedMaxAmount: z.number().int().nullable(),
  offeredAmount: z.number().int().nullable(),
  omittedSpecialContract: z.array(z.string()),
  issue: z.array(
    z.object({
      title: z.string(),
      tags: z.array(z.string()),
    }),
  ),
});

export const draftPreviewSchema = rawDraftPreviewSchema.transform((data) => ({
  ...data,
  issues: data.issue,
}));

export type DraftPreview = z.infer<typeof draftPreviewSchema>;

// issue→issues 별칭은 여기서만 일어나므로 원본 키(issue) 기준으로 대조한다.
type _DraftPreviewDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<z.input<typeof rawDraftPreviewSchema>, CustomerReportDetailResponse>
>;

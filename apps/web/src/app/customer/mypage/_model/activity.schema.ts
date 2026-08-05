import { z } from "zod";
import type { UserActivitySummaryResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

// CONTRACT(2026-08-05 실측으로 정정): 2026-07-13 Notion 명세서 DB 전수 조회 시엔 이 엔드포인트가
// 없었으나, 실제 OpenAPI 명세(https://api-dev.brbosang.com/v3/api-docs)엔 존재함 — Notion 미동기화였던 것으로 보임.
// closedCount(종결) 정의·소스는 여전히 백엔드 확인 필요.
export const activitySummarySchema = z.object({
  reportCount: z.number().int().nonnegative(),
  proposalCount: z.number().int().nonnegative(),
  consultCount: z.number().int().nonnegative(),
  closedCount: z.number().int().nonnegative(),
});

export type ActivitySummary = z.infer<typeof activitySummarySchema>;

type _ActivitySummaryDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<ActivitySummary, UserActivitySummaryResponse>
>;

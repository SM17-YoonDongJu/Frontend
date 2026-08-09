import "@/shared/api/client";
import { apply as applyRequest } from "@/shared/api/generated/sdk.gen";
import {
  adjusterApplicationResponseSchema,
  type AdjusterApplicationExtendedBody,
  type AdjusterApplicationResponse,
} from "../_model/adjuster-application.schema";

// POST /users/adjuster-applications — 봉투 해제 + 201 응답 zod 검증.
// 실패 시 client가 err.name=서버 code(MISSING_REQUIRED_FIELD / DUPLICATE_RESOURCE 등)로 throw.
export async function applyAdjuster(
  body: AdjusterApplicationExtendedBody,
): Promise<AdjusterApplicationResponse> {
  const { data } = await applyRequest({
    throwOnError: true,
    body: {
      ...body,
      licenseNo: body.licenseNo ?? undefined,
      licenseImageUrl: body.licenseImageUrl ?? undefined,
      career: body.career ?? undefined,
      introduction: body.introduction ?? undefined,
    },
  });
  return adjusterApplicationResponseSchema.parse(data);
}

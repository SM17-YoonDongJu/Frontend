import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import {
  adjusterApplicationResponseSchema,
  type AdjusterApplicationExtendedBody,
  type AdjusterApplicationResponse,
} from "../_model/adjuster-application.schema";

// POST /users/adjuster-applications — 봉투 해제 + 201 응답 zod 검증.
// 실패 시 fetchJson이 err.name=서버 code(MISSING_REQUIRED_FIELD / DUPLICATE_RESOURCE 등)로 throw.
export function applyAdjuster(
  body: AdjusterApplicationExtendedBody,
): Promise<AdjusterApplicationResponse> {
  return fetchJson(
    `${API_BASE_URL}/users/adjuster-applications`,
    adjusterApplicationResponseSchema,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

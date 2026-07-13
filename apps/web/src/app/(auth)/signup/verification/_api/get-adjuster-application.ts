import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import {
  adjusterApplicationStatusSchema,
  type AdjusterApplicationStatus,
} from "../_model/adjuster-application.schema";

// GET /users/adjuster-applications/me — 봉투 해제 + zod 검증.
// 404 POST_NOT_FOUND는 "신청 이력 없음"이라 에러가 아니라 정상 분기 → null로 흡수(NOT_APPLIED).
// 401 LOGIN_REQUIRED·5xx는 그대로 throw(훅에서 isError).
export async function getAdjusterApplication(): Promise<AdjusterApplicationStatus | null> {
  try {
    return await fetchJson(
      `${API_BASE_URL}/users/adjuster-applications/me`,
      adjusterApplicationStatusSchema,
    );
  } catch (error) {
    if (error instanceof Error && error.name === "POST_NOT_FOUND") return null;
    throw error;
  }
}

import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { activitySummarySchema } from "../_model/activity.schema";
import type { ActivitySummary } from "../_model/types";

// CONTRACT(명세없음-임시, 이슈 #105): GET /users/me/activity-summary.
export function getActivitySummary(): Promise<ActivitySummary> {
  return fetchJson(
    `${API_BASE_URL}/users/me/activity-summary`,
    activitySummarySchema,
  );
}

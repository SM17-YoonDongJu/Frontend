import "@/shared/api/client";
import { activitySummary as activitySummaryRequest } from "@/shared/api/generated/sdk.gen";
import { activitySummarySchema } from "../_model/activity.schema";
import type { ActivitySummary } from "../_model/types";

// GET /users/me/activity-summary
export async function getActivitySummary(): Promise<ActivitySummary> {
  const { data } = await activitySummaryRequest({ throwOnError: true });
  return activitySummarySchema.parse(data);
}

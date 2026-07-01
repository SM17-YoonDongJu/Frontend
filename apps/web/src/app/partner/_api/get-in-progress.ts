import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { inProgressListSchema } from "../_model/dashboard.schema";
import type { InProgressList } from "../_model/types";

export function getInProgressCases(): Promise<InProgressList> {
  return fetchJson(
    `${API_BASE_URL}/adjusters/me/in-progress`,
    inProgressListSchema,
  );
}

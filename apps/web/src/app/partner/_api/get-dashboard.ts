import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { dashboardSchema } from "../_model/dashboard.schema";
import type { Dashboard } from "../_model/types";

export function getDashboard(): Promise<Dashboard> {
  return fetchJson(`${API_BASE_URL}/adjusters/me/dashboard`, dashboardSchema);
}

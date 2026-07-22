import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { dashboardSchema, type Dashboard } from "../_model/dashboard.schema";

export function getDashboard(): Promise<Dashboard> {
  return fetchJson(`${API_BASE_URL}/users/me/dashboard`, dashboardSchema);
}

import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { adjusterProfileSchema } from "../_model/profile.schema";
import type { AdjusterProfile } from "../_model/types";

export function getProfile(): Promise<AdjusterProfile> {
  return fetchJson(`${API_BASE_URL}/adjusters/me/profile`, adjusterProfileSchema);
}

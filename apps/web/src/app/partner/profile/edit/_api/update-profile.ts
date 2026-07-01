import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { adjusterProfileSchema } from "../_model/adjuster-profile.schema";
import type { AdjusterProfile, UpdateProfileBody } from "../_model/types";

export function updateProfile(body: UpdateProfileBody): Promise<AdjusterProfile> {
  return fetchJson(`${API_BASE_URL}/adjusters/me/profile`, adjusterProfileSchema, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

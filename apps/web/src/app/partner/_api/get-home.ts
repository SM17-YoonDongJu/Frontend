import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { adjusterHomeSchema } from "../_model/home.schema";
import type { AdjusterHome } from "../_model/types";

export function getAdjusterHome(inProgressLimit = 5): Promise<AdjusterHome> {
  return fetchJson(
    `${API_BASE_URL}/adjusters/me/home?in_progress_limit=${inProgressLimit}`,
    adjusterHomeSchema,
  );
}

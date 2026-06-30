import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { adjusterDetailSchema } from "../_model/adjuster-detail.schema";
import type { AdjusterDetail } from "../_model/types";

export function getAdjusterDetail(adjusterId: string): Promise<AdjusterDetail> {
  return fetchJson(`${API_BASE_URL}/adjusters/${adjusterId}`, adjusterDetailSchema);
}

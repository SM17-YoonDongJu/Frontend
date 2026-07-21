import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import type { AdjusterListFilter } from "@/shared/api/query-keys";
import {
  adjusterListSchema,
  type AdjusterList,
} from "../model/adjuster-list.schema";

function toQueryString(filter: AdjusterListFilter): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    if (value === undefined || value === null) continue;
    const str = String(value).trim();
    if (str === "") continue;
    params.set(key, str);
  }
  return params.toString();
}

export function getAdjusters(filter: AdjusterListFilter = {}): Promise<AdjusterList> {
  const qs = toQueryString(filter);
  return fetchJson(`${API_BASE_URL}/adjusters${qs ? `?${qs}` : ""}`, adjusterListSchema);
}

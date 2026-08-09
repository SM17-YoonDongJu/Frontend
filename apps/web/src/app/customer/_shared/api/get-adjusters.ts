import "@/shared/api/client";
import { getAdjusters as getAdjustersRequest } from "@/shared/api/generated/sdk.gen";
import type { AdjusterListFilter } from "@/shared/api/query-keys";
import {
  adjusterListSchema,
  type AdjusterList,
} from "../model/adjuster-list.schema";

function toQuery(filter: AdjusterListFilter): AdjusterListFilter {
  const query: AdjusterListFilter = {};
  for (const [key, value] of Object.entries(filter) as [keyof AdjusterListFilter, unknown][]) {
    if (value === undefined || value === null) continue;
    const str = String(value).trim();
    if (str === "") continue;
    (query[key] as unknown) = value;
  }
  return query;
}

export async function getAdjusters(filter: AdjusterListFilter = {}): Promise<AdjusterList> {
  const { data } = await getAdjustersRequest({
    throwOnError: true,
    query: toQuery(filter),
  });
  return adjusterListSchema.parse(data);
}

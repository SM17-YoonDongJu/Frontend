import "@/shared/api/client";
import { getAdjusterDetail as getAdjusterDetailRequest } from "@/shared/api/generated/sdk.gen";
import { adjusterDetailSchema } from "../_model/adjuster-detail.schema";
import type { AdjusterDetail } from "../_model/types";

export async function getAdjusterDetail(adjusterId: string): Promise<AdjusterDetail> {
  const { data } = await getAdjusterDetailRequest({
    throwOnError: true,
    path: { adjusterId },
  });
  return adjusterDetailSchema.parse(data);
}

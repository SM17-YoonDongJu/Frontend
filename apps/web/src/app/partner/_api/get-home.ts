import "@/shared/api/client";
import { home } from "@/shared/api/generated/sdk.gen";
import { adjusterHomeSchema } from "../_model/home.schema";
import type { AdjusterHome } from "../_model/types";

export async function getAdjusterHome(inProgressLimit = 5): Promise<AdjusterHome> {
  const { data } = await home({
    throwOnError: true,
    query: { in_progress_limit: inProgressLimit },
  });
  return adjusterHomeSchema.parse(data);
}

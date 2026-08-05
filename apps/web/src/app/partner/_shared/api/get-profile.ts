import "@/shared/api/client";
import { getProfile as getProfileRequest } from "@/shared/api/generated/sdk.gen";
import { adjusterProfileSchema } from "../model/adjuster-profile.schema";
import type { AdjusterProfile } from "../model/adjuster-profile.schema";

export async function getProfile(): Promise<AdjusterProfile> {
  const { data } = await getProfileRequest({ throwOnError: true });
  return adjusterProfileSchema.parse(data);
}

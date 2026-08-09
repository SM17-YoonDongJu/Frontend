import "@/shared/api/client";
import { updateProfile as updateProfileRequest } from "@/shared/api/generated/sdk.gen";
import { adjusterProfileSchema } from "@/app/partner/_shared/model/adjuster-profile.schema";
import type { AdjusterProfile } from "@/app/partner/_shared/model/adjuster-profile.schema";
import type { UpdateProfileBody } from "../_model/types";

export async function updateProfile(body: UpdateProfileBody): Promise<AdjusterProfile> {
  const { data } = await updateProfileRequest({
    throwOnError: true,
    body: { ...body, avatarUrl: body.avatarUrl ?? undefined },
  });
  return adjusterProfileSchema.parse(data);
}

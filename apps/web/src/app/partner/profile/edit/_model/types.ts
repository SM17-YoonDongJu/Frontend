import type { z } from "zod";
import type {
  adjusterProfileSchema,
  careerItemSchema,
  profileFormSchema,
  updateProfileBodySchema,
} from "./adjuster-profile.schema";

export type AdjusterProfile = z.infer<typeof adjusterProfileSchema>;
export type CareerItem = z.infer<typeof careerItemSchema>;
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>;

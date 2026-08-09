import type { z } from "zod";
import type {
  careerItemSchema,
  profileFormSchema,
  updateProfileBodySchema,
} from "./adjuster-profile.schema";

export type CareerItem = z.infer<typeof careerItemSchema>;
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>;

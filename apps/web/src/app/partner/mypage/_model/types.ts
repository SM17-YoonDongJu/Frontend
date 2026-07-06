import type { z } from "zod";
import type {
  userRoleSchema,
  mypageProfileSchema,
  mypageStatsSchema,
  mypageMonthlyActivitySchema,
  mypageCertificationSchema,
  mypageSchema,
} from "./mypage.schema";

export type UserRole = z.infer<typeof userRoleSchema>;
export type MypageProfile = z.infer<typeof mypageProfileSchema>;
export type MypageStats = z.infer<typeof mypageStatsSchema>;
export type MypageMonthlyActivity = z.infer<typeof mypageMonthlyActivitySchema>;
export type MypageCertification = z.infer<typeof mypageCertificationSchema>;
export type Mypage = z.infer<typeof mypageSchema>;

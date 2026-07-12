import { z } from "zod";

// 회원 구분(등급/검증) — userType(피보험자/사정사 축)과 별개. 혼용 금지.
// partner/mypage에서 src/shared로 승격(이슈 #105). `일반 회원`=USER, 파트너 전환 노출=CERTIFICATED_ADJUSTER.
export const userRoleSchema = z.enum([
  "USER",
  "CERTIFICATED_ADJUSTER",
  "UNCERTIFICATED_ADJUSTER",
  "ADMIN",
]);

export type UserRole = z.infer<typeof userRoleSchema>;

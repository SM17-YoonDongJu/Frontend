// 마이페이지 도메인 타입 집약(partner 관례). 스키마 z.infer 재노출.
export type {
  ActivitySummary,
} from "./activity.schema";
export type {
  PolicyStatus,
  InsuranceItem,
  InsuranceList,
  AddInsuranceBody,
} from "./insurance.schema";
export type { AnalysisStep } from "./analysis-step";

// 프로필은 신규 스키마 없음 — 확장된 shared meSchema 재사용.
export type { Me, UpdateMeBody, SocialProvider } from "@/shared/model/user";
export type { UserRole } from "@/shared/model/user-role";

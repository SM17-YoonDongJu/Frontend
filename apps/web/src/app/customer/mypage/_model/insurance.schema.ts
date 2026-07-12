import { z } from "zod";

// CONTRACT(명세없음-임시, 이슈 #105): 내 보험 목록/추가 GET·POST /users/me/insurances.
// 보험 도메인이 명세·사전에 전무 — 초안 .pr-assets/api-spec-draft-user-mypage.md. 백엔드 미확정.
export const policyStatusSchema = z.enum(["REGISTERED", "UNREGISTERED"]);

export const insuranceItemSchema = z.object({
  insuranceId: z.uuid(),
  insurerName: z.string(),
  productName: z.string(),
  riders: z.array(z.string()),
  policyStatus: policyStatusSchema,
});

export const insuranceListSchema = z.object({
  list: z.array(insuranceItemSchema),
});

// 직접 입력 추가 — 증권 미등록 상태로 생성(증권 업로드는 별도 파이프라인, 범위 제외).
export const addInsuranceBodySchema = z.object({
  insurerName: z.string().min(1),
  productName: z.string().min(1),
  riders: z.array(z.string()).optional(),
});

export type PolicyStatus = z.infer<typeof policyStatusSchema>;
export type InsuranceItem = z.infer<typeof insuranceItemSchema>;
export type InsuranceList = z.infer<typeof insuranceListSchema>;
export type AddInsuranceBody = z.infer<typeof addInsuranceBodySchema>;

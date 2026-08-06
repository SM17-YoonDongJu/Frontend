import { z } from "zod";

// GET /users/me/insurances(백엔드 UserInsuranceListResponse) — 조회 전용, POST 엔드포인트 없음(추가 UI는 준비 중).
export const insuranceItemSchema = z.object({
  id: z.uuid(),
  insurerName: z.string(),
  productName: z.string(),
  policyNo: z.string().nullish(),
  enrolledAt: z.string().nullish(),
  // null이면 빈 배열로 coalesce(백엔드도 동일하게 null-safe 처리, 소비처 무방어 .length 접근).
  coverages: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
  // 증권 등록 여부 배지용 — 등록 전이면 null.
  policyFileUrl: z.string().nullish(),
});

export const insuranceListSchema = z.object({
  list: z.array(insuranceItemSchema),
});

export type InsuranceItem = z.infer<typeof insuranceItemSchema>;
export type InsuranceList = z.infer<typeof insuranceListSchema>;

// list 배열 원소는 명세가 범용 Item 스키마로 나와 있어 항목별 대조는 생략(adjuster-list와 동일 사유).

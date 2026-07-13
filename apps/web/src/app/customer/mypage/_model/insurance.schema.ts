import { z } from "zod";

// GET·POST /users/me/insurances — Notion API 명세서 DB 확정(2026-07-13).
// matchStatus = 약관 마스터 fuzzy 매칭 결과(UNMATCHED이면 약관분석 불가). 증권 파일 등록 여부와 축이 다르다 → 카드 배지에 쓰지 않는다.
export const matchStatusSchema = z.enum(["MATCHED", "PENDING", "UNMATCHED"]);

export const insuranceItemSchema = z.object({
  id: z.uuid(),
  insurerName: z.string(),
  productName: z.string(),
  // CONTRACT(nullable 여부 백엔드 확인 필요): GET 응답엔 필수로 명세됐지만 POST에선 선택 입력이다.
  // 값 없이 생성된 행이 존재할 수 있어 nullish로 선방어한다.
  policyNo: z.string().nullish(),
  enrolledAt: z.string().nullish(),
  // .default([])는 키 부재(undefined)만 흡수하고 null이면 파싱이 터진다 — 보장 없는 행이 null로 오면 목록 전체가 죽는다.
  // 같은 ⚠️C 축의 policyNo·enrolledAt과 동일하게 null도 흡수하되, 출력 타입은 string[]로 유지(소비처 무방어 .length 접근).
  coverages: z
    .array(z.string())
    .nullish()
    .transform((value) => value ?? []),
  matchStatus: matchStatusSchema,
  // CONTRACT(명세없음-확장 요청 중, 이슈 #105): 카드 배지가 증권 파일 등록 여부를 표시 — GET list에 필드 부재.
  // 등재 전까지 undefined→null로 "미등록" 표시.
  policyFileUrl: z.string().nullish(),
});

export const insuranceListSchema = z.object({
  list: z.array(insuranceItemSchema),
});

// POST body — 필수는 insurerName·productName뿐. 나머지는 증권 업로드·OCR 모달(별도 이슈)용 슬롯.
export const addInsuranceBodySchema = z.object({
  insurerName: z.string().min(1),
  productName: z.string().min(1),
  coverages: z.array(z.string()).optional(),
  policyNo: z.string().optional(),
  enrolledAt: z.string().optional(),
  policyFileUrl: z.string().optional(),
  ocrResultId: z.uuid().optional(),
});

// POST 201 응답 data는 생성 id 단건 — 전체 객체가 아니다(insuranceItemSchema로 파싱 금지).
export const addInsuranceResultSchema = z.object({
  id: z.uuid(),
});

export type MatchStatus = z.infer<typeof matchStatusSchema>;
export type InsuranceItem = z.infer<typeof insuranceItemSchema>;
export type InsuranceList = z.infer<typeof insuranceListSchema>;
export type AddInsuranceBody = z.infer<typeof addInsuranceBodySchema>;
export type AddInsuranceResult = z.infer<typeof addInsuranceResultSchema>;

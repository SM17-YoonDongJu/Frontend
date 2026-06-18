import { z } from "zod";
import {
  step1AccidentTypeSchema,
  step2TreatmentSchema,
  step3DateSchema,
  step4InsuranceSchema,
  step5DocumentSchema,
  step6ConsentSchema,
} from "./report-request.schema";

/** 퍼널 단계 정의. title=진행바 라벨, schema=해당 step "다음" 진입 검증. */
export interface FunnelStep {
  title: string;
  schema: z.ZodType;
}

export const FUNNEL_STEPS: FunnelStep[] = [
  { title: "사고 유형", schema: step1AccidentTypeSchema },
  { title: "사건 상세", schema: step2TreatmentSchema },
  { title: "사고 일자", schema: step3DateSchema },
  { title: "보험금·보험", schema: step4InsuranceSchema },
  { title: "서류 업로드", schema: step5DocumentSchema },
  { title: "확인", schema: step6ConsentSchema },
];

export const FUNNEL_TOTAL = FUNNEL_STEPS.length;

/** 선행 단계가 모두 통과하는 한도 = 도달 가능한 최대 step(1-based). */
export function firstIncompleteStep(values: unknown): number {
  for (let i = 0; i < FUNNEL_STEPS.length; i++) {
    if (!FUNNEL_STEPS[i]!.schema.safeParse(values).success) return i + 1;
  }
  return FUNNEL_TOTAL;
}

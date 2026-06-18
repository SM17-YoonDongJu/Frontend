import { z } from "zod";
import { step1AccidentTypeSchema, step2TreatmentSchema } from "./report-request.schema";

/** 퍼널 단계 정의. title=진행바 라벨, schema=해당 step "다음" 진입 검증. */
export interface FunnelStep {
  title: string;
  schema: z.ZodType;
}

/** 아직 구현 안 된 step은 통과(빈 스키마). 슬라이스마다 교체. */
const PASS = z.object({});

export const FUNNEL_STEPS: FunnelStep[] = [
  { title: "사고 유형", schema: step1AccidentTypeSchema },
  { title: "사건 상세", schema: step2TreatmentSchema },
  { title: "사고 일자", schema: PASS },
  { title: "보험금·보험", schema: PASS },
  { title: "서류 업로드", schema: PASS },
  { title: "확인", schema: PASS },
];

export const FUNNEL_TOTAL = FUNNEL_STEPS.length;

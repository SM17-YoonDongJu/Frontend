import type { AdjustRequestDraft } from "./types";

/** 퍼널 단계 정의. title=진행바 우측 라벨, fields=해당 step에서 검증할 draft 필드. */
export interface FunnelStep {
  title: string;
  fields: (keyof AdjustRequestDraft)[];
}

export const FUNNEL_STEPS: FunnelStep[] = [
  { title: "사고 유형", fields: ["accidentType"] },
  { title: "사건 상세", fields: [] },
  { title: "사고 일자", fields: [] },
  { title: "보험금·보험", fields: [] },
  { title: "서류 업로드", fields: [] },
  { title: "확인", fields: [] },
];

export const FUNNEL_TOTAL = FUNNEL_STEPS.length;

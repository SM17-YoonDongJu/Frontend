import type { ReportListItemStatus } from "@/app/customer/_shared/model/report-list.schema";

// 진행 중 분석 스테퍼 4단계 — FE 파생값(서버 enum 아님). 라벨은 UI에서 매핑.
// INFO_INPUT 정보 입력 · AI_ANALYSIS AI 분석 · EXPERT_REVIEW 전문가 검수 · PROPOSAL_ARRIVED 제안 도착
export const ANALYSIS_STEPS = [
  "INFO_INPUT",
  "AI_ANALYSIS",
  "EXPERT_REVIEW",
  "PROPOSAL_ARRIVED",
] as const;

export type AnalysisStep = (typeof ANALYSIS_STEPS)[number];

// CONTRACT(FE 파생, 백엔드 step 필드 부재 — 이슈 #105): report status → 스테퍼 단계 매핑.
// 5개 status 전부 커버 + toAnalysisStep 미매핑 fallback.
const STATUS_TO_STEP: Record<ReportListItemStatus, AnalysisStep> = {
  AWAITING_INSPECTION: "INFO_INPUT",
  AWAITING_ADOPTION: "AI_ANALYSIS",
  COUNSELING: "EXPERT_REVIEW",
  MATCHED: "PROPOSAL_ARRIVED",
  NOT_SELECTED: "PROPOSAL_ARRIVED",
};

export function toAnalysisStep(status: string): AnalysisStep {
  return STATUS_TO_STEP[status as ReportListItemStatus] ?? "INFO_INPUT";
}

export function analysisStepIndex(step: AnalysisStep): number {
  return ANALYSIS_STEPS.indexOf(step);
}

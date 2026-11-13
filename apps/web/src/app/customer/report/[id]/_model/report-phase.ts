import type { ReportDetail } from "./types";

/**
 * 상세 화면이 어느 단계의 리포트인지. 화면·PDF의 분기 기준을 한 곳에 둔다.
 * - analyzing: 분석 중(본문 없음)
 * - analysisStopped: 분석이 멈춤(FAILED·BLOCKED·NEEDS_REUPLOAD·알 수 없는 값, 본문 숨김)
 * - awaitingInspection: 분석 완료, 사정사 검수 전(AI 분석 결과만 있음)
 * - proposalsArrived: 검수가 들어와 제안·상담 단계(아직 최종 채택 전)
 * - adopted: 최종 채택됨(검수 의견 있음)
 */
export type ReportPhase =
  | "analyzing"
  | "analysisStopped"
  | "awaitingInspection"
  | "proposalsArrived"
  | "adopted";

export function reportPhase(
  report: Pick<ReportDetail, "analysisState" | "status" | "reviewedAt">,
): ReportPhase {
  // reviewedAt은 최종 채택 뒤에만 채워진다 — 제안 도착·상담 중에는 null이다.
  if (report.reviewedAt != null) return "adopted";
  if (report.analysisState === "PROCESSING") return "analyzing";
  if (report.analysisState !== "COMPLETED") return "analysisStopped";
  if (report.status === "AWAITING_INSPECTION") return "awaitingInspection";
  return "proposalsArrived";
}

/** AI 분석 본문(금액·쟁점·보장·근거)을 보여줄 수 있는 단계. */
export function hasAnalysisBody(phase: ReportPhase): boolean {
  return phase === "awaitingInspection" || phase === "proposalsArrived" || phase === "adopted";
}

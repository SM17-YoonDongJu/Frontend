import { accidentTypeLabel } from "@/shared/model/accident-type";
import type { ReportListItem } from "./report-list.schema";

/**
 * 목록 응답(GET /reports)에 title/diagnosis 필드가 없어(명세 미확정) 새 필드를 지어내지 않고
 * 기존 필드(accidentType·treatment)만으로 "분석 요청" 제목을 파생한다.
 */
export function deriveReportTitle(
  report: Pick<ReportListItem, "accidentType" | "treatment">,
): string {
  const label = accidentTypeLabel(report.accidentType ?? "");
  return report.treatment ? `${label} · ${report.treatment} 분석 요청` : `${label} 분석 요청`;
}

/** 목록 카드 CTA — 도착한 제안 수를 반영, 0건이면 현황 문구로. */
export function proposalsCtaLabel(proposalCount: number): string {
  return proposalCount > 0 ? `제안 ${proposalCount}건 보기` : "제안 현황 보기";
}

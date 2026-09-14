import { accidentTypeLabel } from "@/shared/model/accident-type";
import type { ReportListItem } from "./report-list.schema";

const FALLBACK_SUBJECT = "보상";

interface ReportTitleSource {
  title?: string | null;
  accidentType: ReportListItem["accidentType"];
  treatment?: ReportListItem["treatment"];
}

/**
 * 제목이 없는 리포트의 표시 제목을 사고 유형·치료 내용으로 파생한다(예: "실손 의료비 · 통원 분석 요청").
 * 제목은 분석이 끝난 뒤 서버가 채우므로, 그 전에는 새 필드를 지어내지 않고 신청 때 받은 값만 쓴다.
 */
function deriveReportTitle(report: ReportTitleSource): string {
  const subject = report.accidentType ? accidentTypeLabel(report.accidentType) : FALLBACK_SUBJECT;
  return report.treatment ? `${subject} · ${report.treatment} 분석 요청` : `${subject} 분석 요청`;
}

/** 리포트 화면 공통 제목. 서버 제목이 있으면 그대로, 비어 있으면 파생 제목(#314). */
export function reportDisplayTitle(report: ReportTitleSource): string {
  const title = report.title?.trim();
  return title ? title : deriveReportTitle(report);
}

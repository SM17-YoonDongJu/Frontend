export type ReportListStatus =
  | "AWAITING_INSPECTION"
  | "AWAITING_ADOPTION"
  | "COUNSELING"
  | "MATCHED"
  | "CLOSED";

/** 리포트 카드 상태 표시(배지 아님, 아이콘+텍스트). */
export const REPORT_STATUS_META: Record<
  ReportListStatus,
  { label: string; className: string; showCheck: boolean }
> = {
  AWAITING_INSPECTION: { label: "분석 완료", className: "text-gold-ink", showCheck: false },
  AWAITING_ADOPTION: { label: "채택 대기", className: "text-gold-ink", showCheck: false },
  COUNSELING: { label: "상담 중", className: "text-ink-2", showCheck: false },
  MATCHED: { label: "검수 완료", className: "text-green", showCheck: true },
  CLOSED: { label: "종결", className: "text-green", showCheck: true },
};

/** 사고 유형 → 배지 색. Figma: 교통사고 골드, 실손 초록, 그 외 뉴트럴. */
export function getAccidentTone(accidentType: string): { bg: string; text: string } {
  if (accidentType.includes("교통")) return { bg: "bg-gold-soft", text: "text-gold-ink" };
  if (accidentType.includes("실손") || accidentType.includes("의료"))
    return { bg: "bg-green-soft", text: "text-green" };
  return { bg: "bg-paper-2", text: "text-ink-2" };
}

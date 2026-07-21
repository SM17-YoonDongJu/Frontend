export type ReportListStatus =
  | "AWAITING_INSPECTION"
  | "AWAITING_ADOPTION"
  | "COUNSELING"
  | "MATCHED"
  | "CLOSED";

export type ReportStatusTone = "gold" | "green" | "neutral";

/** 리포트 카드 상태 표시. tone은 상태 배지·좌측 스파인 색을 함께 결정. */
export const REPORT_STATUS_META: Record<
  ReportListStatus,
  { label: string; tone: ReportStatusTone; showCheck: boolean }
> = {
  AWAITING_INSPECTION: { label: "분석 완료", tone: "gold", showCheck: false },
  AWAITING_ADOPTION: { label: "채택 대기", tone: "gold", showCheck: false },
  COUNSELING: { label: "상담 중", tone: "neutral", showCheck: false },
  MATCHED: { label: "검수 완료", tone: "green", showCheck: true },
  CLOSED: { label: "종결", tone: "green", showCheck: true },
};

/** 상태 tone → 카드 좌측 스파인 배경 유틸. */
export const REPORT_STATUS_SPINE: Record<ReportStatusTone, string> = {
  gold: "bg-gold",
  green: "bg-green",
  neutral: "bg-ink-3/30",
};

export type ReportListStatus =
  | "AWAITING_INSPECTION"
  | "AWAITING_ADOPTION"
  | "COUNSELING"
  | "CLOSED"
  | "NOT_SELECTED";

export type ReportStatusTone = "gold" | "green" | "navy" | "neutral";

/**
 * 리포트 카드 상태 표시. tone은 상태 배지·좌측 스파인 색을 함께 결정.
 * 라벨은 ERD REPORTS.status 주석 그대로. COUNSELING은 기존 화면 전반 표기를 따라 "상담 중" 유지.
 * 색 의미는 리포트 상세(report/[id]/_model/report-status.ts)와 정렬:
 * 대기=neutral · 사용자 액션 필요=gold · 상담 진행=navy · 완료=green · 미선정=neutral.
 */
export const REPORT_STATUS_META: Record<
  ReportListStatus,
  { label: string; tone: ReportStatusTone; showCheck: boolean }
> = {
  AWAITING_INSPECTION: { label: "검수 대기", tone: "neutral", showCheck: false },
  AWAITING_ADOPTION: { label: "채택 대기", tone: "gold", showCheck: false },
  COUNSELING: { label: "상담 중", tone: "navy", showCheck: false },
  CLOSED: { label: "종결", tone: "green", showCheck: true },
  NOT_SELECTED: { label: "선택 받지 못함", tone: "neutral", showCheck: false },
};

/** 상태 tone → 카드 좌측 스파인 배경 유틸. */
export const REPORT_STATUS_SPINE: Record<ReportStatusTone, string> = {
  gold: "bg-gold",
  green: "bg-green",
  navy: "bg-navy",
  neutral: "bg-ink-3/40",
};

export type ReportListStatus =
  | "AWAITING_INSPECTION"
  | "AWAITING_ADOPTION"
  | "COUNSELING"
  | "MATCHED"
  | "NOT_SELECTED";

export type ReportStatusTone = "gold" | "green" | "navy" | "neutral";

/**
 * 리포트 카드 상태 표시. tone은 상태 배지·좌측 스파인 색을 함께 결정.
 * 라벨은 ERD REPORTS.status 주석 그대로. COUNSELING은 기존 화면 전반 표기를 따라 "상담 중" 유지.
 * 진행 상태만 색을 갖고(대기=neutral · 액션 필요=gold · 상담=navy),
 * 종료 상태(CLOSED·NOT_SELECTED)는 muted — 카드 전체를 회색 톤으로 가라앉힌다.
 */
export const REPORT_STATUS_META: Record<
  ReportListStatus,
  { label: string; tone: ReportStatusTone; showCheck: boolean; muted: boolean }
> = {
  AWAITING_INSPECTION: { label: "검수 대기", tone: "neutral", showCheck: false, muted: false },
  AWAITING_ADOPTION: { label: "채택 대기", tone: "gold", showCheck: false, muted: false },
  COUNSELING: { label: "상담 중", tone: "navy", showCheck: false, muted: false },
  MATCHED: { label: "종결", tone: "neutral", showCheck: true, muted: true },
  NOT_SELECTED: { label: "선택 받지 못함", tone: "neutral", showCheck: false, muted: true },
};

/** 상태 tone → 카드 좌측 스파인 배경 유틸. */
export const REPORT_STATUS_SPINE: Record<ReportStatusTone, string> = {
  gold: "bg-gold",
  green: "bg-green",
  navy: "bg-navy",
  neutral: "bg-ink-3/40",
};

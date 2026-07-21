import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { ReportStatus } from "./types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

// 라벨은 ERD REPORTS.status 주석 그대로(COUNSELING만 화면 전반 표기 따라 "상담 중" 유지).
export const REPORT_STATUS_META: Record<
  ReportStatus,
  { label: string; tone: Tone; nextStep: string }
> = {
  AWAITING_INSPECTION: { label: "검수 대기", tone: "neutral", nextStep: "검수 진행 중" },
  AWAITING_ADOPTION: { label: "채택 대기", tone: "gold", nextStep: "사정사 채택 대기" },
  COUNSELING: { label: "상담 중", tone: "navy", nextStep: "상담 진행" },
  CLOSED: { label: "종결", tone: "green", nextStep: "후기 작성" },
  NOT_SELECTED: { label: "선택 받지 못함", tone: "neutral", nextStep: "다른 제안 검토" },
};

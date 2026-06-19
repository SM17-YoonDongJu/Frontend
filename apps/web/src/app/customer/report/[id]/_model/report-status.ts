import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { ReportStatus } from "./types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

export const REPORT_STATUS_META: Record<
  ReportStatus,
  { label: string; tone: Tone; nextStep: string }
> = {
  AWAITING_INSPECTION: { label: "검수 대기", tone: "neutral", nextStep: "검수 진행 중" },
  AWAITING_ADOPTION: { label: "채택 대기", tone: "gold", nextStep: "사정사 채택 대기" },
  COUNSELING: { label: "상담 중", tone: "navy", nextStep: "상담 진행" },
  MATCHED: { label: "검수 완료", tone: "green", nextStep: "자료 보강 후 재산정" },
};

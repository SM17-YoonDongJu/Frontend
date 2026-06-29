import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

export type ReportListStatus =
  | "AWAITING_INSPECTION"
  | "AWAITING_ADOPTION"
  | "COUNSELING"
  | "MATCHED";

export const REPORT_STATUS_META: Record<
  ReportListStatus,
  { label: string; tone: Tone }
> = {
  AWAITING_INSPECTION: { label: "검수 대기", tone: "neutral" },
  AWAITING_ADOPTION: { label: "채택 대기", tone: "gold" },
  COUNSELING: { label: "상담 중", tone: "navy" },
  MATCHED: { label: "검수 완료", tone: "green" },
};

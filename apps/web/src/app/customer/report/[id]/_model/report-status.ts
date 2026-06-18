import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { ReportStatus } from "./types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

export const REPORT_STATUS_META: Record<ReportStatus, { label: string; tone: Tone }> = {
  AWAITING_INSPECTION: { label: "검수 대기", tone: "neutral" },
  AWAITING_ADOPTION: { label: "채택 대기", tone: "gold" },
  COUNSELING: { label: "상담 중", tone: "navy" },
  MATCHED: { label: "검수 완료", tone: "green" },
};

import type { StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { ReportListItemStatus } from "@/app/customer/_shared/model/report-list.schema";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

interface ReportCardStatusMeta {
  label: string;
  tone: Tone;
  /** 종결·완료 뱃지의 체크 아이콘 노출 여부. */
  hasCheck: boolean;
}

const REPORT_CARD_STATUS_META: Record<ReportListItemStatus, ReportCardStatusMeta> = {
  AWAITING_INSPECTION: { label: "검수 대기", tone: "neutral", hasCheck: false },
  AWAITING_ADOPTION: { label: "제안 도착", tone: "gold", hasCheck: false },
  COUNSELING: { label: "상담 전환", tone: "gold", hasCheck: false },
  MATCHED: { label: "검수 완료", tone: "green", hasCheck: true },
  CLOSED: { label: "종결", tone: "green", hasCheck: true },
};

const FALLBACK_META: ReportCardStatusMeta = { label: "", tone: "neutral", hasCheck: false };

export function reportCardStatusMeta(status: ReportListItemStatus): ReportCardStatusMeta {
  return REPORT_CARD_STATUS_META[status] ?? FALLBACK_META;
}

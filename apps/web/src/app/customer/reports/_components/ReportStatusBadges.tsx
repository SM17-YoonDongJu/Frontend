import type { ReportListItem } from "@/app/customer/_shared/model/report-list.schema";
import { ANALYSIS_STOPPED_COPY } from "@/app/customer/_shared/model/analysis-state";
import { REPORT_STATUS_META } from "@/app/customer/_shared/model/report-status";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { Check } from "@/shared/ui/icons/Check";
import { Spinner } from "@/shared/ui/icons/Spinner";

export function ReportStatusBadges({ item }: { item: ReportListItem }) {
  // 분석이 멈춘 리포트는 검수 대기 배지(스피너)와 모순되지 않게 멈춘 상태를 표시한다.
  const stopped = ANALYSIS_STOPPED_COPY[item.analysisState];
  if (stopped) {
    return (
      <StatusBadge tone="terra" className="rounded-pill">
        {stopped.badge}
      </StatusBadge>
    );
  }

  if (item.status === "AWAITING_ADOPTION") {
    return (
      <>
        <StatusBadge tone="gold" className="rounded-pill">
          제안 도착
        </StatusBadge>
        {item.newProposalCount ? (
          <StatusBadge tone="terra" className="rounded-[0.3125rem] px-1.5 py-0.5 text-[0.625rem]">
            NEW {item.newProposalCount}
          </StatusBadge>
        ) : null}
      </>
    );
  }
  if (item.status === "AWAITING_INSPECTION") {
    return (
      <StatusBadge tone="gold" className="rounded-pill" icon={<Spinner />}>
        검수 대기 중
      </StatusBadge>
    );
  }
  if (item.status === "MATCHED") {
    return (
      <StatusBadge
        tone="neutral"
        className="rounded-pill bg-ink-3/[0.13] text-ink-3"
        icon={<Check className="size-3" />}
      >
        종결
      </StatusBadge>
    );
  }

  const meta = REPORT_STATUS_META[item.status];
  return (
    <StatusBadge tone={meta.tone} className="rounded-pill">
      {meta.label}
    </StatusBadge>
  );
}

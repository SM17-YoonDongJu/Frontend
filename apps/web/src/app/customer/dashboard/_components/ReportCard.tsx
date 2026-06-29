import Link from "next/link";
import { AmountRange } from "@/shared/ui/AmountRange";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { REPORT_STATUS_META } from "@/app/customer/_shared/model/report-status";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
import type { ReportListItem } from "../_model/types";

export function ReportCard({ report }: { report: ReportListItem }) {
  const {
    reportId,
    accidentType,
    reportNo,
    status,
    claimedMinAmount,
    claimedMaxAmount,
    proposalCount,
  } = report;
  const meta = REPORT_STATUS_META[status];

  return (
    <article className="rounded-card border border-line bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <StatusBadge tone="neutral">{accidentType}</StatusBadge>
            <span className="text-[13px] text-ink-3">No.{reportNo}</span>
          </div>
          <p className="mt-3 text-[12px] text-ink-3">예상 보상범위 · 참고용</p>
          <AmountRange
            className="mt-1 block"
            min={claimedMinAmount}
            max={claimedMaxAmount}
          />
        </div>
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line-2 pt-4">
        <span className="text-[13px] text-ink-2">제안 {proposalCount}건</span>
        <Link
          href={DASHBOARD_LINKS.report(reportId)}
          className="text-[13px] font-semibold text-gold-ink transition hover:brightness-[.96]"
        >
          리포트 보기
        </Link>
      </div>
    </article>
  );
}

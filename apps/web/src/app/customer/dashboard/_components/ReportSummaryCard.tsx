import Link from "next/link";
import { formatManwon } from "@/shared/lib/format-amount";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import type {
  ReportListItem,
  ReportStatus,
} from "@/app/customer/_shared/model/report-list.schema";
import { reportProposalsHref } from "@/app/customer/_shared/model/report-routes";
import { REPORT_STATUS_META } from "@/app/customer/_shared/model/report-status";
import { deriveReportTitle } from "@/app/customer/_shared/model/report-title";

type PillTone = "gold" | "green" | "neutral";

const STATUS_PILL: Partial<Record<ReportStatus, { label: string; tone: PillTone }>> = {
  AWAITING_INSPECTION: { label: "검수 중", tone: "neutral" },
  AWAITING_ADOPTION: { label: "제안 도착", tone: "gold" },
  COUNSELING: { label: "매칭 완료", tone: "green" },
};

const PILL_TONE_CLASS: Record<PillTone, string> = {
  gold: "bg-gold-soft text-gold-ink",
  green: "bg-green-soft text-green",
  neutral: "bg-line-2 text-ink-3",
};

function formatMonthDay(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}. ${date.getDate()}`;
}

function reportSubtitle(report: ReportListItem): string {
  const type = accidentTypeLabel(report.accidentType);
  return report.adjusterNickname ? `${type} · ${report.adjusterNickname} 사정사` : type;
}

function reportFooter(report: ReportListItem): { label: string; value: string } {
  const confirmedAmount = report.confirmedMaxAmount ?? report.confirmedMinAmount ?? null;

  switch (report.status) {
    case "AWAITING_ADOPTION":
      return { label: "받은 제안", value: `${report.proposalCount}건` };
    case "COUNSELING":
      return {
        label: "확정 보상액",
        value: confirmedAmount !== null ? `${formatManwon(confirmedAmount)}만원` : "협의 중",
      };
    case "AWAITING_INSPECTION":
      return { label: "진행 상태", value: "검수 진행 중" };
    default:
      return { label: "진행 상태", value: REPORT_STATUS_META[report.status].label };
  }
}

export function ReportSummaryCard({ report }: { report: ReportListItem }) {
  const pill = STATUS_PILL[report.status];
  const footer = reportFooter(report);
  const title = report.title ?? deriveReportTitle(report);

  return (
    <Link
      href={reportProposalsHref(report.reportId)}
      className="flex flex-col rounded-card border border-line bg-card p-[1.3125rem] transition hover:brightness-[.98]"
    >
      <div className="flex items-center justify-between">
        {pill ? (
          <span
            className={`rounded-pill px-2.5 py-1 text-xs font-semibold ${PILL_TONE_CLASS[pill.tone]}`}
          >
            {pill.label}
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs text-ink-3">{formatMonthDay(report.createdAt)} 신청</span>
      </div>

      <p className="mt-3.5 truncate text-[0.9375rem] font-semibold leading-[1.4] text-ink">
        {title}
      </p>
      <p className="mt-1 truncate text-[0.8125rem] text-ink-3">{reportSubtitle(report)}</p>

      <div className="mt-4 flex items-center justify-between border-t border-line-2 pt-3.5">
        <span className="text-[0.8125rem] text-ink-3">{footer.label}</span>
        <span className="font-serif text-[0.9375rem] font-bold text-ink">{footer.value}</span>
      </div>
    </Link>
  );
}

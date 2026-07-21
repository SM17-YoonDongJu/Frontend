import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { Check } from "@/shared/ui/icons/Check";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import {
  REPORT_STATUS_META,
  REPORT_STATUS_SPINE,
} from "@/app/customer/_shared/model/report-status";
import { deriveReportTitle } from "@/app/customer/_shared/model/report-title";
import { reportDetailHref } from "@/app/customer/_shared/model/report-routes";
import type { ReportListItem } from "@/app/customer/_shared/model/report-list.schema";

function toManwon(won: number): string {
  return Math.round(won / 10_000).toLocaleString("ko-KR");
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return year && month && day ? `${year}.${month}.${day}` : iso;
}

export function ReportCard({
  report,
  href,
  ctaLabel,
}: {
  report: ReportListItem;
  href?: string;
  ctaLabel?: string;
}) {
  const { reportId, reportNo, status, claimedMinAmount, claimedMaxAmount } = report;
  const meta = REPORT_STATUS_META[status];
  const title = deriveReportTitle(report);
  const targetHref = href ?? reportDetailHref(reportId);
  const cta = ctaLabel ?? "리포트 보기";

  return (
    <article className="relative overflow-hidden rounded-card border border-line bg-card shadow-card transition hover:shadow-raised">
      <span
        aria-hidden
        className={`absolute inset-y-4 left-0 w-1 rounded-full ${REPORT_STATUS_SPINE[meta.tone]}`}
      />

      <div className="py-[1.3125rem] pl-[1.625rem] pr-[1.3125rem]">
        <div className="flex items-center gap-2">
          <StatusBadge
            tone={meta.tone}
            className="shrink-0"
            icon={meta.showCheck ? <Check className="text-[0.8125rem]" /> : undefined}
          >
            {meta.label}
          </StatusBadge>
          <span className="ml-auto shrink-0 whitespace-nowrap text-[0.75rem] text-ink-3">
            No.{reportNo}
          </span>
        </div>

        <p className="mt-3 text-[1.0625rem] font-bold leading-[1.35] text-ink">{title}</p>

        <div className="mt-3.5">
          <p className="text-[0.71875rem] font-medium text-ink-3">예상 보상 범위</p>
          <p className="mt-1 text-ink">
            <span className="font-serif text-[1.5rem] leading-none">
              {toManwon(claimedMinAmount)} – {toManwon(claimedMaxAmount)}
            </span>
            <span className="ml-1 text-[0.8125rem] font-bold">만원</span>
          </p>
        </div>

        <div className="mt-[1.125rem] flex items-center justify-between border-t border-line-2 pt-3.5">
          <span className="text-[0.75rem] text-ink-3">{formatDate(report.createdAt)}</span>
          <Link href={targetHref} className={buttonVariants({ variant: "outline", size: "sm" })}>
            {cta}
            <ArrowRight className="text-[1.0625rem]" />
          </Link>
        </div>
      </div>
    </article>
  );
}

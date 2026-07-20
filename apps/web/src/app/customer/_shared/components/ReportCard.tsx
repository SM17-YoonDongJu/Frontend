import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { Check } from "@/shared/ui/icons/Check";
import {
  getAccidentTone,
  REPORT_STATUS_META,
} from "@/app/customer/_shared/model/report-status";
import { reportDetailHref } from "@/app/customer/_shared/model/report-routes";
import type { ReportListItem } from "@/app/customer/_shared/model/report-list.schema";

function toManwon(won: number): string {
  return Math.round(won / 10_000).toLocaleString("ko-KR");
}

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
  const tone = getAccidentTone(accidentType);

  return (
    <article className="rounded-card border border-line bg-card p-[1.3125rem] shadow-[0px_1px_1px_rgba(21,32,46,0.03)]">
      <div className="flex items-center gap-2">
        <span
          className={`rounded-pill px-2.5 py-[0.1875rem] text-[0.78125rem] font-semibold ${tone.bg} ${tone.text}`}
        >
          {accidentType}
        </span>
        <span className="text-[0.75rem] text-ink-3">No.{reportNo}</span>
        <span
          className={`ml-auto flex items-center gap-[0.3125rem] text-[0.75rem] font-semibold ${meta.className}`}
        >
          {meta.showCheck && <Check className="text-[0.8125rem]" />}
          {meta.label}
        </span>
      </div>

      <div className="mt-[0.875rem] flex items-end justify-between">
        <div>
          <p className="text-[0.71875rem] text-ink-3">예상 보상 범위</p>
          <p className="mt-[0.1875rem] text-ink">
            <span className="font-serif text-[1.375rem]">
              {toManwon(claimedMinAmount)} – {toManwon(claimedMaxAmount)}
            </span>
            <span className="ml-1 text-[0.8125rem] font-bold">만원</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[0.78125rem] text-ink-3">제안 {proposalCount}건</span>
          <Link
            href={reportDetailHref(reportId)}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            리포트 보기
            <ArrowRight className="text-[1.0625rem]" />
          </Link>
        </div>
      </div>
    </article>
  );
}

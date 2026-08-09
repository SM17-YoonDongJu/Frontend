import Link from "next/link";
import type { ReportListItem } from "@/app/customer/_shared/model/report-list.schema";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";

export function AnalysisCta({ report }: { report: ReportListItem }) {
  const hasProposals = report.proposalCount > 0;
  const href = hasProposals
    ? `/customer/proposals/${report.reportId}`
    : `/customer/report/${report.reportId}`;
  const label = hasProposals
    ? `받은 제안 ${report.proposalCount}건 보기`
    : "분석 상세 보기";

  return (
    <Link
      href={href}
      className="mt-4 flex items-center justify-center gap-1.5 rounded-button bg-paper-2 py-3 text-[0.875rem] font-bold text-ink transition hover:brightness-[.96]"
    >
      {label}
      <ArrowRight className="size-[1.0625rem]" />
    </Link>
  );
}

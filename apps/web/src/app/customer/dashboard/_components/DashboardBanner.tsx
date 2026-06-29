"use client";

import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { FileText } from "@/shared/ui/icons/FileText";
import { useMe } from "@/shared/api/use-me";
import { useReportList } from "../_api/use-report-list";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
import type { ReportStatus } from "../_model/types";

const IN_PROGRESS_STATUSES: ReadonlySet<ReportStatus> = new Set<ReportStatus>([
  "AWAITING_INSPECTION",
  "AWAITING_ADOPTION",
  "COUNSELING",
]);

export function DashboardBanner() {
  const { data: me } = useMe();
  const { data: reportList } = useReportList();

  const inProgressCount = reportList.list.filter((report) =>
    IN_PROGRESS_STATUSES.has(report.status),
  ).length;
  const receivedProposalCount = reportList.list.reduce(
    (sum, report) => sum + report.proposalCount,
    0,
  );

  return (
    <section className="rounded-card-lg bg-navy px-7 py-8 text-white">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[14px] text-paper-2/80">
            {me.nickname} 님, 안녕하세요
          </p>
          <h1 className="mt-2 font-serif text-[26px] font-bold leading-snug">
            내 손해사정 진행 현황을 한눈에 확인하세요
          </h1>
          <p className="mt-2 text-[14px] text-paper-2/70">
            새 사고가 있다면 분석을 신청하고, 받은 제안을 비교해 보세요.
          </p>
          <Link
            href={DASHBOARD_LINKS.newAnalysis}
            className={buttonVariants({
              variant: "gold",
              size: "md",
              className: "mt-5",
            })}
          >
            <FileText className="text-[18px]" />새 분석 시작
          </Link>
        </div>

        <dl className="flex shrink-0 gap-4">
          <BannerStat label="진행 중" value={inProgressCount} />
          <BannerStat label="받은 제안" value={receivedProposalCount} />
        </dl>
      </div>
    </section>
  );
}

function BannerStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-[7rem] rounded-card bg-card/10 px-5 py-4 text-center">
      <dd className="font-serif text-[28px] font-bold leading-none">{value}</dd>
      <dt className="mt-2 text-[13px] text-paper-2/70">{label}</dt>
    </div>
  );
}

"use client";

import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
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
    <section className="relative overflow-hidden rounded-card-lg bg-navy px-9 py-[2.125rem] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-[12.5rem] rounded-full border border-white/[0.07]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[1.875rem] top-[1.875rem] size-[12.5rem] rounded-full border border-white/[0.05]"
      />

      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-[0.84375rem] font-semibold text-gold-2">
            {me.nickname} 님, 안녕하세요
          </p>
          <h1 className="mt-2 font-serif text-[2rem] font-bold leading-[2.6rem] text-white">
            받은 보험금,
            <br />
            적정한지 분석해보세요
          </h1>
          <p className="mt-2 max-w-[27.5rem] text-[0.90625rem] leading-[1.45rem] text-white/65">
            약관·특약·판례를 분석해 예상 보상 범위와 쟁점을 리포트로 정리하고, 검증된
            손해사정사가 검수합니다.
          </p>
          <Link
            href={DASHBOARD_LINKS.newAnalysis}
            className={buttonVariants({ variant: "gold", size: "md", className: "mt-5" })}
          >
            새 분석 시작
            <ArrowRight className="text-[1.1875rem]" />
          </Link>
        </div>

        <dl className="flex shrink-0 gap-3">
          <BannerStat label="진행 중" value={inProgressCount} />
          <BannerStat label="받은 제안" value={receivedProposalCount} accent />
        </dl>
      </div>
    </section>
  );
}

function BannerStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="w-24 rounded-[0.875rem] border border-white/10 bg-white/[0.06] py-[1.1875rem] text-center">
      <dd
        className={`font-serif text-[1.625rem] font-bold leading-none ${accent ? "text-gold-2" : "text-white"}`}
      >
        {value}
      </dd>
      <dt className="mt-2 text-[0.71875rem] text-white/55">{label}</dt>
    </div>
  );
}

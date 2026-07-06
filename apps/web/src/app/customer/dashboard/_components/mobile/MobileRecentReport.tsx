"use client";

import Link from "next/link";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { useReportList } from "@/app/customer/dashboard/_api/use-report-list";
import { DASHBOARD_LINKS } from "@/app/customer/dashboard/_model/dashboard-links";
import type { ReportListItem } from "@/app/customer/dashboard/_model/types";
import { EmptyState } from "../EmptyState";
import { OfferRangeBar, toManwon } from "./OfferRangeBar";

function formatCreatedAt(iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}.${month}.${day} 생성`;
}

export function MobileRecentReport() {
  const { data: reportList } = useReportList();
  const latestReport = reportList.list[0];

  return (
    <section>
      <header className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">최근 리포트</h2>
        <Link
          href={DASHBOARD_LINKS.allReports}
          className="text-[0.8125rem] font-medium text-ink-3 transition hover:text-ink-2"
        >
          전체보기
        </Link>
      </header>

      <div className="mt-3.5">
        {latestReport ? (
          <RecentReportCard report={latestReport} />
        ) : (
          <EmptyState
            message="아직 분석한 리포트가 없어요"
            cta={{ label: "새 분석 시작", href: DASHBOARD_LINKS.newAnalysis }}
          />
        )}
      </div>
    </section>
  );
}

function RecentReportCard({ report }: { report: ReportListItem }) {
  const {
    reportId,
    accidentType,
    treatment,
    claimedMinAmount,
    claimedMaxAmount,
    offeredAmount,
    createdAt,
  } = report;

  return (
    <article className="rounded-card border border-line bg-card p-[1.125rem] shadow-[0px_1px_1px_rgba(21,32,46,0.03)]">
      <div className="flex items-center justify-between">
        <span className="text-[0.8125rem] font-bold text-ink-2">
          {accidentTypeLabel(accidentType)}
          {treatment && ` · ${treatment}`}
        </span>
        <span className="flex items-center gap-1.5 rounded-tag bg-terra-soft px-2.5 py-1 text-[0.75rem] font-bold text-terra">
          <AlertTriangle className="text-[0.8125rem]" />
          검토 권장
        </span>
      </div>

      <p className="mt-3.5 text-[0.75rem] font-medium text-ink-3">
        검토 가능한 예상 보상 범위 · 참고용 추정
      </p>
      <p className="mt-1 text-ink">
        <span className="font-serif text-[1.6875rem] font-bold">
          {toManwon(claimedMinAmount)} – {toManwon(claimedMaxAmount)}
        </span>
        <span className="ml-1 text-[1.0625rem] font-bold text-ink-2">만원</span>
      </p>

      <div className="mt-6">
        <OfferRangeBar
          min={claimedMinAmount}
          max={claimedMaxAmount}
          offeredAmount={offeredAmount}
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line-2 pt-3.5">
        <span className="text-[0.75rem] text-ink-3">{formatCreatedAt(createdAt)}</span>
        <Link
          href={DASHBOARD_LINKS.report(reportId)}
          className="flex items-center gap-1 text-[0.8125rem] font-bold text-ink transition hover:text-ink-2"
        >
          리포트 보기
          <ChevronRight className="text-[0.9375rem]" />
        </Link>
      </div>
    </article>
  );
}

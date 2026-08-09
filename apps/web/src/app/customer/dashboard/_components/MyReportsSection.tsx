"use client";

import Link from "next/link";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { dedupeByReportId } from "@/app/customer/_shared/model/dedupe-report-list";
import { useReportList } from "../_api/use-report-list";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
import { EmptyState } from "./EmptyState";
import { ReportSummaryCard } from "./ReportSummaryCard";

const VISIBLE_REPORT_COUNT = 3;

export function MyReportsSection() {
  const { data: reportList } = useReportList();
  const reports = dedupeByReportId(reportList.list).slice(0, VISIBLE_REPORT_COUNT);

  return (
    <section>
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-[1.125rem] font-bold text-ink">내 분석 리포트</h2>
        <Link
          href={DASHBOARD_LINKS.allReports}
          className="flex items-center gap-[0.3125rem] text-[0.84375rem] font-semibold text-ink-2 transition hover:text-ink"
        >
          전체 보기
          <ChevronRight className="text-[0.9375rem]" />
        </Link>
      </header>

      {reports.length === 0 ? (
        <EmptyState
          message="아직 분석한 리포트가 없어요"
          cta={{ label: "새 분석 시작", href: DASHBOARD_LINKS.newAnalysis }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {reports.map((report) => (
            <ReportSummaryCard key={report.reportId} report={report} />
          ))}
        </div>
      )}
    </section>
  );
}

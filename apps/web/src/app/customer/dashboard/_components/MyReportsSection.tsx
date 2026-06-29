"use client";

import Link from "next/link";
import { useReportList } from "../_api/use-report-list";
import { DASHBOARD_LINKS } from "../_model/dashboard-links";
import { EmptyState } from "./EmptyState";
import { ReportCard } from "./ReportCard";

const VISIBLE_REPORT_COUNT = 4;

export function MyReportsSection() {
  const { data: reportList } = useReportList();
  const reports = reportList.list.slice(0, VISIBLE_REPORT_COUNT);

  return (
    <section>
      <header className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-[20px] font-bold text-ink">내 분석 리포트</h2>
        <Link
          href={DASHBOARD_LINKS.allReports}
          className="text-[13px] text-ink-3 transition hover:text-ink"
        >
          전체 보기
        </Link>
      </header>

      {reports.length === 0 ? (
        <EmptyState
          message="아직 분석한 리포트가 없어요"
          cta={{ label: "새 분석 시작", href: DASHBOARD_LINKS.newAnalysis }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <ReportCard key={report.reportId} report={report} />
          ))}
        </div>
      )}
    </section>
  );
}

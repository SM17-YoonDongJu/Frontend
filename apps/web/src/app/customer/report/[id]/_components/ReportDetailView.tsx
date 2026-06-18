"use client";

import { useReportDetail } from "../_api/use-report-detail";
import { CoverageApplicable } from "./CoverageApplicable";
import { CoveragePotentialMissing } from "./CoveragePotentialMissing";
import { EstimatedPayout } from "./EstimatedPayout";
import { IssueReview } from "./IssueReview";
import { LegalBasis } from "./LegalBasis";
import { AdjusterContact } from "./AdjusterContact";
import { ReportActions } from "./ReportActions";
import { ReportHeader } from "./ReportHeader";
import { ReportSummary } from "./ReportSummary";
import { ReportSummaryAside } from "./ReportSummaryAside";

export function ReportDetailView({ reportId }: { reportId: string }) {
  const { data, isPending, isError } = useReportDetail(reportId);

  if (isPending) {
    return <p className="px-4 py-16 text-center text-ink-3">리포트를 불러오는 중…</p>;
  }

  if (isError || !data) {
    return <p className="px-4 py-16 text-center text-ink-3">리포트를 불러오지 못했습니다.</p>;
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-8">
      <ReportHeader
        accidentType={data.accidentType}
        treatment={data.treatment}
        issueCount={data.issue.length}
        actions={<ReportActions report={data} />}
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
        <ReportSummary
          status={data.status}
          reviewComment={data.reviewComment}
          reviewedAt={data.reviewedAt}
          adjusterName={data.adjuster?.nickname}
          adjusterCareer={data.adjuster?.career}
        />
        <EstimatedPayout
          claimedMinAmount={data.claimedMinAmount}
          claimedMaxAmount={data.claimedMaxAmount}
          confidenceLevel={data.confidenceLevel}
        />
        <IssueReview issues={data.issue} />
        <div className="grid gap-6 md:grid-cols-2">
          <CoverageApplicable guarantees={data.applicableGuarantees} />
          <CoveragePotentialMissing contracts={data.omittedSpecialContract} />
        </div>
        <LegalBasis items={data.basisTermsPrecedents} />
      </div>
      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <ReportSummaryAside
          status={data.status}
          claimedMinAmount={data.claimedMinAmount}
          claimedMaxAmount={data.claimedMaxAmount}
          offeredAmount={data.offeredAmount}
        />
        <AdjusterContact nickname={data.adjuster?.nickname} />
      </aside>
      </div>
    </div>
  );
}

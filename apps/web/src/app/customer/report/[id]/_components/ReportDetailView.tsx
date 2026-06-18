"use client";

import { useReportDetail } from "../_api/use-report-detail";
import { CoverageApplicable } from "./CoverageApplicable";
import { CoveragePotentialMissing } from "./CoveragePotentialMissing";
import { EstimatedPayout } from "./EstimatedPayout";
import { IssueReview } from "./IssueReview";
import { ReportSummary } from "./ReportSummary";

export function ReportDetailView({ reportId }: { reportId: string }) {
  const { data, isPending, isError } = useReportDetail(reportId);

  if (isPending) {
    return <p className="px-4 py-16 text-center text-ink-3">리포트를 불러오는 중…</p>;
  }

  if (isError || !data) {
    return <p className="px-4 py-16 text-center text-ink-3">리포트를 불러오지 못했습니다.</p>;
  }

  return (
    <div className="mx-auto grid w-full max-w-[1080px] gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <ReportSummary
          status={data.status}
          accidentType={data.accidentType}
          treatment={data.treatment}
        />
        <EstimatedPayout
          claimedMinAmount={data.claimedMinAmount}
          claimedMaxAmount={data.claimedMaxAmount}
          offeredAmount={data.offeredAmount}
        />
        <IssueReview issues={data.issue} />
        <div className="grid gap-6 md:grid-cols-2">
          <CoverageApplicable guarantees={data.applicableGuarantees} />
          <CoveragePotentialMissing contracts={data.omittedSpecialContract} />
        </div>
      </div>
      <aside />
    </div>
  );
}

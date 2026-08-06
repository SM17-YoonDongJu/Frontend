"use client";

import { useSharedReport } from "../_api/use-shared-report";
import { AdjusterSummaryCard } from "./AdjusterSummaryCard";
import { CoverageBasisSections } from "./CoverageBasisSections";
import { SharedIssueList } from "./SharedIssueList";
import { SharedReportHeader } from "./SharedReportHeader";
import { SharedReportSummary } from "./SharedReportSummary";

const SHARED_REPORT_DISCLAIMER =
  "본 검수 결과는 사정사의 참고용 의견이며 실제 지급액은 보험사 심사 결과에 따라 달라질 수 있습니다. 법률 자문이 아닙니다.";

export function SharedReportView({ chatRoomId }: { chatRoomId: string }) {
  const { data } = useSharedReport(chatRoomId);

  return (
    <div className="mx-auto w-full max-w-[67.5rem] px-5 pb-9 pt-[1.125rem] tracking-[-0.01rem] lg:px-4 lg:py-8">
      <SharedReportHeader
        title={data.title}
        caseNo={data.caseNo}
        accidentType={data.accidentType}
        submittedAt={data.submittedAt}
        backHref={`/customer/chat/${chatRoomId}`}
      />

      <div className="mt-[1.125rem] space-y-[1.125rem] lg:mt-6 lg:space-y-6">
        <AdjusterSummaryCard
          adjuster={data.adjuster}
          estimate={data.estimate}
          offeredAmount={data.offeredAmount}
        />
        <SharedReportSummary summary={data.summary} />
        <SharedIssueList issues={data.issues} />
        <CoverageBasisSections
          applicableGuarantees={data.applicableGuarantees}
          omittedSpecialContract={data.omittedSpecialContract}
          basisTermsPrecedents={data.basisTermsPrecedents}
        />

        <p className="pt-1 text-center text-[0.68rem] leading-[1.15rem] text-ink-3">
          {SHARED_REPORT_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}

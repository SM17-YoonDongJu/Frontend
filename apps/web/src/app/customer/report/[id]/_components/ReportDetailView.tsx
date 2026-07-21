"use client";

import { useMe } from "@/shared/api/use-me";
import { useReportDetail } from "../_api/use-report-detail";
import { AdjusterContact } from "./AdjusterContact";
import { CoverageApplicable } from "./CoverageApplicable";
import { CoveragePotentialMissing } from "./CoveragePotentialMissing";
import { EstimatedPayout } from "./EstimatedPayout";
import { IssueReview } from "./IssueReview";
import { LegalBasis } from "./LegalBasis";
import { ReportActions } from "./ReportActions";
import { ReportHeader } from "./ReportHeader";
import { ReportSummary } from "./ReportSummary";
import { ReportSummaryAside } from "./ReportSummaryAside";

const REPORT_DISCLAIMER =
  "본 리포트는 참고용 추정 분석이며 법적 효력이 없습니다. 모든 사실 주장에 [조항]·[판례] 출처를 표기합니다.";

export function ReportDetailView({ reportId }: { reportId: string }) {
  const { data } = useReportDetail(reportId);
  const { data: me } = useMe();
  const isAdjuster = me.userType === "adjuster";

  const showAdjusterContact = !isAdjuster && data.adjuster?.nickname != null;

  return (
    <div className="mx-auto w-full max-w-[67.5rem] px-5 pb-9 pt-[1.125rem] tracking-[-0.01rem] lg:px-4 lg:py-8">
      <ReportHeader
        accidentType={data.accidentType}
        treatment={data.treatment}
        issueCount={data.issues.length}
        actions={<ReportActions report={data} />}
        mobileShare={<ReportActions report={data} compact />}
      />

      <div className="mt-[1.125rem] lg:mt-6 lg:grid lg:grid-cols-[1fr_20rem] lg:gap-6">
        <div className="space-y-[1.125rem] lg:space-y-6">
          {/* 모바일 메타 행 */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 lg:hidden">
            <span className="break-keep rounded-pill bg-paper px-2.5 py-1 text-[0.75rem] font-semibold text-ink-2">
              {data.accidentType}
            </span>
            {data.caseNo && (
              <span className="shrink-0 whitespace-nowrap text-[0.75rem] text-ink-3">
                No.{data.caseNo}
              </span>
            )}
            {data.reviewedAt != null && (
              <span className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap rounded-tag bg-green-soft px-2 py-1 text-[0.6875rem] font-semibold text-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                검수 완료
              </span>
            )}
          </div>

          <ReportSummary
            status={data.status}
            reviewComment={data.reviewComment}
            reviewedAt={data.reviewedAt}
            adjusterName={data.adjuster?.nickname}
            adjusterCareer={data.adjuster?.career}
            adjusterId={data.adjusterId}
          />
          <EstimatedPayout
            claimedMinAmount={data.claimedMinAmount}
            claimedMaxAmount={data.claimedMaxAmount}
            offeredAmount={data.offeredAmount}
            confidenceLevel={data.confidenceLevel}
          />
          <IssueReview issues={data.issues} />
          <div className="space-y-[1.125rem] md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:block lg:space-y-6">
            <CoverageApplicable guarantees={data.applicableGuarantees} />
            <CoveragePotentialMissing contracts={data.omittedSpecialContract} />
          </div>
          <LegalBasis items={data.basisTermsPrecedents} />

          {showAdjusterContact && (
            <div className="lg:hidden">
              <AdjusterContact
                nickname={data.adjuster?.nickname}
                adjusterId={data.adjusterId}
                variant="mobile"
              />
            </div>
          )}

          <p className="pt-1 text-center text-[0.68rem] leading-[1.15rem] text-ink-3">
            {REPORT_DISCLAIMER}
          </p>
        </div>

        <aside className="hidden space-y-6 lg:block lg:sticky lg:top-6 lg:self-start">
          <ReportSummaryAside
            status={data.status}
            claimedMinAmount={data.claimedMinAmount}
            claimedMaxAmount={data.claimedMaxAmount}
            offeredAmount={data.offeredAmount}
          />
          {showAdjusterContact && (
            <AdjusterContact
              nickname={data.adjuster?.nickname}
              adjusterId={data.adjusterId}
              variant="desktop"
            />
          )}
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useMe } from "@/shared/api/use-me";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { Check } from "@/shared/ui/icons/Check";
import { useReportDetail } from "../_api/use-report-detail";
import { REPORT_DISCLAIMER } from "../_model/report-meta";
import { hasAnalysisBody, reportPhase } from "../_model/report-phase";
import { AdjusterContact } from "./AdjusterContact";
import { CoverageApplicable } from "./CoverageApplicable";
import { CoveragePotentialMissing } from "./CoveragePotentialMissing";
import { EstimatedPayout } from "./EstimatedPayout";
import { IssueReview } from "./IssueReview";
import { LegalBasis } from "./LegalBasis";
import { ReportActions } from "./ReportActions";
import { ReportHeader } from "./ReportHeader";
import { ReportPhaseNotice } from "./ReportPhaseNotice";
import { ReportSummary } from "./ReportSummary";
import { ReportSummaryAside } from "./ReportSummaryAside";

export function ReportDetailView({ reportId }: { reportId: string }) {
  const { data } = useReportDetail(reportId);
  const { data: me } = useMe();
  const isAdjuster = me.userType === "adjuster";

  const showAdjusterContact = !isAdjuster && data.adjuster?.nickname != null;
  const phase = reportPhase(data);
  const showBody = hasAnalysisBody(phase);

  return (
    <div className="mx-auto w-full max-w-[67.5rem] px-5 pb-9 pt-[1.125rem] tracking-[-0.01rem] lg:px-4 lg:py-8">
      <ReportHeader
        accidentType={accidentTypeLabel(data.accidentType)}
        treatment={data.treatment}
        issueCount={showBody ? data.issues.length : undefined}
        actions={<ReportActions report={data} />}
        mobileShare={<ReportActions report={data} compact />}
      />

      <div className="mt-[1.125rem] lg:mt-6 lg:grid lg:grid-cols-[1fr_20rem] lg:gap-6">
        <div className="space-y-[1.125rem] lg:space-y-6">
          {/* 모바일 메타 행 */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 lg:hidden">
            <span className="break-keep rounded-pill bg-paper px-2.5 py-1 text-[0.75rem] font-semibold text-ink-2">
              {accidentTypeLabel(data.accidentType)}
            </span>
            {data.caseNo && (
              <span className="shrink-0 whitespace-nowrap text-[0.75rem] text-ink-3">
                No.{data.caseNo}
              </span>
            )}
            {data.reviewedAt != null && (
              <span className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap rounded-tag bg-green-soft px-2 py-1 text-[0.6875rem] font-semibold text-green">
                <Check className="text-[0.75rem]" />
                검수 완료
              </span>
            )}
          </div>

          {phase !== "adopted" ? (
            !isAdjuster && <ReportPhaseNotice phase={phase} reportId={reportId} />
          ) : (
            <ReportSummary
              status={data.status}
              reviewComment={data.reviewComment}
              reviewedAt={data.reviewedAt}
              adjusterName={data.adjuster?.nickname}
              adjusterCareer={data.adjuster?.career != null ? `${data.adjuster.career}년차` : null}
              adjusterId={data.adjusterId}
            />
          )}

          {showBody && (
            <div>
              <p className="mb-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-gold-ink lg:text-[0.8125rem]">
                AI 분석 결과
              </p>
              <div className="space-y-[1.125rem] lg:space-y-6">
                <EstimatedPayout
                  claimedMinAmount={data.claimedMinAmount}
                  claimedMaxAmount={data.claimedMaxAmount}
                  offeredAmount={data.offeredAmount}
                  confidenceLevel={data.confidenceLevel === "UNKNOWN" ? null : data.confidenceLevel}
                />
                <IssueReview issues={data.issues} isReviewed={phase === "adopted"} />
                <div className="space-y-[1.125rem] md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:block lg:space-y-6">
                  <CoverageApplicable guarantees={data.applicableGuarantees} />
                  <CoveragePotentialMissing contracts={data.omittedSpecialContract} />
                </div>
                <LegalBasis items={data.basisTermsPrecedents} />
              </div>
            </div>
          )}

          {showAdjusterContact && (
            <div className="lg:hidden">
              <AdjusterContact
                nickname={data.adjuster?.nickname}
                adjusterId={data.adjusterId}
                variant="mobile"
              />
            </div>
          )}

          {showBody && (
            <p className="pt-1 text-center text-[0.68rem] leading-[1.15rem] text-ink-3">
              {REPORT_DISCLAIMER}
            </p>
          )}
        </div>

        <aside className="hidden space-y-6 lg:block lg:sticky lg:top-6 lg:self-start">
          {showBody && (
            <ReportSummaryAside
              phase={phase}
              status={data.status}
              claimedMinAmount={data.claimedMinAmount}
              claimedMaxAmount={data.claimedMaxAmount}
              offeredAmount={data.offeredAmount}
            />
          )}
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

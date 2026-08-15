"use client";

import { useMe } from "@/shared/api/use-me";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { Check } from "@/shared/ui/icons/Check";
import { useReportDetail } from "../_api/use-report-detail";
import { AdjusterContact } from "./AdjusterContact";
import { CoverageApplicable } from "./CoverageApplicable";
import { CoveragePotentialMissing } from "./CoveragePotentialMissing";
import { EstimatedPayout } from "./EstimatedPayout";
import { IssueReview } from "./IssueReview";
import { LegalBasis } from "./LegalBasis";
import { ReportActions } from "./ReportActions";
import { ReportHeader } from "./ReportHeader";
import { ReportReviewPending } from "./ReportReviewPending";
import { ReportSummary } from "./ReportSummary";
import { ReportSummaryAside } from "./ReportSummaryAside";

const REPORT_DISCLAIMER =
  "본 리포트는 참고용 추정 분석이며 법적 효력이 없습니다. 모든 사실 주장에 [조항]·[판례] 출처를 표기합니다.";

export function ReportDetailView({ reportId }: { reportId: string }) {
  const { data } = useReportDetail(reportId);
  const { data: me } = useMe();
  const isAdjuster = me.userType === "adjuster";

  const showAdjusterContact = !isAdjuster && data.adjuster?.nickname != null;
  // 사정사 검수 전에는 검수 의견 자리에 대기 안내를 둔다(사정사는 검수하러 들어온 화면이라 제외).
  const isAwaitingReview = data.status === "AWAITING_INSPECTION" || data.reviewedAt == null;

  return (
    <div className="mx-auto w-full max-w-[67.5rem] px-5 pb-9 pt-[1.125rem] tracking-[-0.01rem] lg:px-4 lg:py-8">
      <ReportHeader
        accidentType={accidentTypeLabel(data.accidentType)}
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

          {isAwaitingReview ? (
            !isAdjuster && <ReportReviewPending reportId={reportId} />
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

          <div>
            <p className="mb-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-gold-ink lg:text-[0.8125rem]">
              AI 분석 결과
            </p>
            <div className="space-y-[1.125rem] lg:space-y-6">
              <EstimatedPayout
                claimedMinAmount={data.claimedMinAmount}
                claimedMaxAmount={data.claimedMaxAmount}
                offeredAmount={data.offeredAmount}
                confidenceLevel={
                  data.confidenceLevel === "UNKNOWN" ? null : data.confidenceLevel
                }
              />
              <IssueReview issues={data.issues} />
              <div className="space-y-[1.125rem] md:grid md:grid-cols-2 md:gap-6 md:space-y-0 lg:block lg:space-y-6">
                <CoverageApplicable guarantees={data.applicableGuarantees} />
                <CoveragePotentialMissing contracts={data.omittedSpecialContract} />
              </div>
              <LegalBasis items={data.basisTermsPrecedents} />
            </div>
          </div>

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

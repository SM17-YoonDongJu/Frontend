"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useReviewDetail } from "../_api/use-review-detail";
import { useSubmitReview } from "../_api/use-submit-review";
import { clearReviewDraft, useReviewDraft } from "../_hooks/use-review-draft";
import { AccidentNarrativeSection } from "./AccidentNarrativeSection";
import { AttachmentSection } from "./AttachmentSection";
import { ClaimInfoSection } from "./ClaimInfoSection";
import { ClientAccidentSection } from "./ClientAccidentSection";
import { EstimatedRangeSection } from "./EstimatedRangeSection";
import { IssueBoard } from "./IssueBoard";
import { OverallOpinionSection } from "./OverallOpinionSection";
import { ReviewHeader } from "./ReviewHeader";
import { ReviewSidebar } from "./ReviewSidebar";

export function ReviewDetailView({ reportId }: { reportId: string }) {
  const { data } = useReviewDetail(reportId);
  const { state, derived, actions, toSubmitBody } = useReviewDraft(data);
  const submitReview = useSubmitReview(reportId);
  const router = useRouter();
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  async function handleSaveDraft() {
    setIsSavingDraft(true);
    try {
      await submitReview.mutateAsync(toSubmitBody(state));
    } finally {
      setIsSavingDraft(false);
    }
  }

  async function handleComplete() {
    await submitReview.mutateAsync(toSubmitBody(state, { complete: true }));
    clearReviewDraft(reportId);
    router.push(
      `/partner/review/${reportId}/complete?caseId=${encodeURIComponent(data.caseId)}`,
    );
  }

  return (
    <div className="w-full">
      <div className="border-b border-line bg-card">
        <div className="mx-auto w-full max-w-6xl px-6 py-5">
          <ReviewHeader
            caseId={data.caseId}
            treatment={data.treatment}
            accidentType={data.accidentType}
            region={data.client.region}
            clientName={data.client.maskedName}
            onSaveDraft={handleSaveDraft}
            isSaving={isSavingDraft}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="space-y-5 rounded-card-lg border border-line bg-card p-6">
            <ClientAccidentSection client={data.client} isMasked={data.isMasked} />
            <ClaimInfoSection
              accidentType={data.accidentType}
              treatment={data.treatment}
              accidentDate={data.accidentDate}
              hospitalizations={data.hospitalizations}
              offeredAmount={data.offeredAmount}
              applicableGuarantees={data.applicableGuarantees}
            />
            <AccidentNarrativeSection description={data.description} />
            <AttachmentSection attachments={data.attachments} />
          </section>
          <EstimatedRangeSection
            aiMin={data.claimedMinAmount}
            aiMax={data.claimedMaxAmount}
            confirmedMin={state.confirmedMinAmount}
            confirmedMax={state.confirmedMaxAmount}
            onChangeRange={actions.setRange}
          />
          <IssueBoard issues={state.issues} actions={actions} />
          <OverallOpinionSection value={state.review} onChange={actions.setReview} />
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <ReviewSidebar
            progress={derived.progress}
            counts={derived.counts}
            confirmedMin={state.confirmedMinAmount}
            confirmedMax={state.confirmedMaxAmount}
            reflectedIssueCount={derived.reflectedIssueCount}
            hasOpinion={derived.hasOpinion}
            allReviewed={derived.allReviewed}
            isSubmitting={submitReview.isPending && !isSavingDraft}
            onComplete={handleComplete}
            onRevert={actions.reset}
          />
        </aside>
      </div>
    </div>
  );
}

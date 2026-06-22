"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useReviewDetail } from "../_api/use-review-detail";
import { useSubmitReview } from "../_api/use-submit-review";
import { clearReviewDraft, useReviewDraft } from "../_hooks/use-review-draft";
import { ConfirmDialog } from "./ConfirmDialog";
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
  const { state, derived, actions, toSubmitBody, draftPrompt } = useReviewDraft(data);
  const submitReview = useSubmitReview(reportId);
  const router = useRouter();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [revertOpen, setRevertOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSaveDraft() {
    setIsSavingDraft(true);
    setSubmitError(null);
    try {
      await submitReview.mutateAsync(toSubmitBody(state));
    } catch {
      setSubmitError("임시저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSavingDraft(false);
    }
  }

  async function handleComplete() {
    const missing: string[] = [];
    if (!derived.allReviewed) missing.push("모든 쟁점을 인정·수정·제외로 검토해 주세요.");
    if (!derived.hasOpinion) missing.push("종합 의견을 작성해 주세요.");
    if (missing.length > 0) {
      setSubmitError(`전송 전 확인해 주세요 — ${missing.join(" ")}`);
      return;
    }

    setSubmitError(null);
    try {
      await submitReview.mutateAsync(toSubmitBody(state, { complete: true }));
    } catch {
      setSubmitError("검수 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
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
              insuranceName={data.insuranceName}
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

        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <ReviewSidebar
            progress={derived.progress}
            counts={derived.counts}
            confirmedMin={state.confirmedMinAmount}
            confirmedMax={state.confirmedMaxAmount}
            reflectedIssueCount={derived.reflectedIssueCount}
            hasOpinion={derived.hasOpinion}
            isSubmitting={submitReview.isPending && !isSavingDraft}
            errorMessage={submitError}
            onComplete={handleComplete}
            onRevert={() => setRevertOpen(true)}
          />
        </aside>
      </div>

      <ConfirmDialog
        open={draftPrompt.open}
        title="임시저장된 검수 내용이 있어요"
        description="이전에 작성하던 검수 내용이 남아 있습니다. 이어서 작성할까요? 새로 시작하면 저장된 내용은 지워집니다."
        confirmLabel="이어서 작성"
        cancelLabel="새로 시작"
        dismissible={false}
        onConfirm={draftPrompt.restore}
        onCancel={draftPrompt.discard}
      />

      <ConfirmDialog
        open={revertOpen}
        title="초안으로 되돌릴까요?"
        description="작성한 검수 내용(쟁점 판단·확정 금액·종합 의견)이 모두 사라지고 AI 초안 상태로 돌아갑니다."
        confirmLabel="되돌리기"
        cancelLabel="취소"
        confirmTone="danger"
        onConfirm={() => {
          actions.reset();
          setRevertOpen(false);
        }}
        onCancel={() => setRevertOpen(false)}
      />
    </div>
  );
}

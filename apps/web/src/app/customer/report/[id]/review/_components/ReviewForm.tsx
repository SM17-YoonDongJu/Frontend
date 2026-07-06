"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useMe } from "@/shared/api/use-me";
import { useReportDetail } from "../../_shared/use-report-detail";
import { useCreateReview } from "../_api/use-create-review";
import { maskNickname, saveReviewDonePreview } from "../_hooks/done-preview";
import { useReviewForm } from "../_hooks/use-review-form";
import { CaseSummaryCard } from "./CaseSummaryCard";
import { OverallRatingSection } from "./OverallRatingSection";
import { ReviewActions } from "./ReviewActions";
import { ReviewContentField } from "./ReviewContentField";
import { ReviewFormSkeleton } from "./ReviewFormSkeleton";
import { ReviewHeader } from "./ReviewHeader";

const REDIRECT_ERROR_CODES = new Set(["FORBIDDEN", "POST_NOT_FOUND", "NOT_FOUND"]);

function resolveErrorMessage(error: Error): string {
  if (error.name === "DUPLICATE_RESOURCE") return "이미 등록된 리뷰입니다.";
  return error.message || "리뷰 등록에 실패했어요. 잠시 후 다시 시도해 주세요.";
}

function ReviewFormInner({ reportId }: { reportId: string }) {
  const router = useRouter();
  const detailHref = `/customer/report/${reportId}`;
  const { data: report } = useReportDetail(reportId);
  const { data: me } = useMe();
  const { score, setScore, content, setContent, isSubmittable } = useReviewForm();

  const adjusterId = report.adjusterId;
  const isEligible = report.status === "MATCHED" && adjusterId != null;
  const adjusterName = report.adjuster?.nickname ? `${report.adjuster.nickname} 손해사정사` : "손해사정사";

  const mutation = useCreateReview(reportId, adjusterId ?? "");

  useEffect(() => {
    if (!isEligible) router.replace(detailHref);
  }, [isEligible, detailHref, router]);

  useEffect(() => {
    if (mutation.error && REDIRECT_ERROR_CODES.has(mutation.error.name)) {
      router.replace(detailHref);
    }
  }, [mutation.error, detailHref, router]);

  if (!isEligible || !adjusterId) return <ReviewFormSkeleton />;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSubmittable || mutation.isPending) return;

    const trimmed = content.trim();
    mutation.mutate(
      { score, content: trimmed || undefined },
      {
        onSuccess: () => {
          saveReviewDonePreview(reportId, {
            nickname: maskNickname(me.nickname),
            score,
            content: trimmed,
            adjusterName,
          });
          router.push(`${detailHref}/review/done`);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="text-center lg:text-left">
        <h1 className="font-serif text-[1.75rem] font-bold text-ink lg:text-[1.875rem]">
          사건이 잘 마무리되었나요?
        </h1>
        <p className="mt-2 text-[0.9375rem] text-ink-3">
          남겨주신 리뷰는 손해사정사 프로필에 공개되며, 다른 고객의 선택에 큰 도움이 됩니다.
        </p>
      </div>

      <CaseSummaryCard
        adjusterName={adjusterName}
        subtitle={`${report.accidentType} 보상 분석`}
        confirmedAmount={report.offeredAmount}
      />

      <OverallRatingSection value={score} onChange={setScore} />
      <ReviewContentField value={content} onChange={setContent} />

      {mutation.error && !REDIRECT_ERROR_CODES.has(mutation.error.name) && (
        <p role="alert" className="text-[0.875rem] font-medium text-terra">
          {resolveErrorMessage(mutation.error)}
        </p>
      )}

      <ReviewActions reportId={reportId} isSubmittable={isSubmittable} submitting={mutation.isPending} />
    </form>
  );
}

function ReviewErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-[0.9375rem] text-ink-2">리뷰 화면을 불러오지 못했어요.</p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="rounded-button border border-line px-4 py-2 text-[0.875rem] font-bold text-ink transition hover:bg-paper-2"
      >
        다시 시도
      </button>
    </div>
  );
}

export function ReviewForm({ reportId }: { reportId: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto flex w-full max-w-[40rem] flex-col gap-6 px-4 py-6 lg:py-10">
      <ReviewHeader reportId={reportId} />
      {!mounted ? (
        <ReviewFormSkeleton />
      ) : (
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary onReset={reset} FallbackComponent={ReviewErrorFallback}>
              <Suspense fallback={<ReviewFormSkeleton />}>
                <ReviewFormInner reportId={reportId} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      )}
    </div>
  );
}

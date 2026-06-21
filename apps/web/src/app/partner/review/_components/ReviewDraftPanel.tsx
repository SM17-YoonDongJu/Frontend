"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useReportDetail } from "@/app/customer/report/[id]/_api/use-report-detail";
import { useHoldReview } from "../_api/use-hold-review";
import { AmountRange } from "@/shared/ui/AmountRange";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { StatusBadge, type StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { IssueStatus } from "@/app/customer/report/[id]/_model/types";

const ISSUE_TONE: Record<IssueStatus, NonNullable<StatusBadgeProps["tone"]>> = {
  CONFIRMED: "green",
  TRUSTED: "gold",
  INFO: "neutral",
};

export function ReviewDraftPanel({ reportId }: { reportId: string | null }) {
  return (
    <aside className="lg:sticky lg:top-20">
      {reportId === null ? (
        <DraftPlaceholder />
      ) : (
        <Suspense fallback={<DraftSkeleton />}>
          <DraftContent reportId={reportId} />
        </Suspense>
      )}
    </aside>
  );
}

function DraftContent({ reportId }: { reportId: string }) {
  const { data } = useReportDetail(reportId);
  const router = useRouter();
  const hold = useHoldReview();

  return (
    <div className="rounded-card-lg border border-line bg-card p-5">
      <div className="flex items-center justify-between">
        <StatusBadge tone="navy">{data.accidentType}</StatusBadge>
        <StatusBadge tone="gold">AI 초안</StatusBadge>
      </div>

      <p className="mt-4 text-sm text-ink-3">보상 가능 범위</p>
      <AmountRange size="lg" min={data.claimedMinAmount} max={data.claimedMaxAmount} />

      <section className="mt-5">
        <h3 className="text-sm font-semibold text-ink">AI가 짚은 쟁점 {data.issue.length}건</h3>
        <ul className="mt-2 space-y-3">
          {data.issue.map((issue) => (
            <li key={issue.title} className="rounded-card border border-line-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink">{issue.title}</span>
                <StatusBadge tone={ISSUE_TONE[issue.status]}>{issue.tag ?? "참고"}</StatusBadge>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{issue.opinion}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <h3 className="text-sm font-semibold text-ink">분석 근거</h3>
        <ul className="mt-2 space-y-1 text-[13px] text-ink-2">
          {data.basisTermsPrecedents.map((basis) => (
            <li key={basis}>· {basis}</li>
          ))}
        </ul>
      </section>

      {data.omittedSpecialContract.length > 0 && (
        <section className="mt-5">
          <h3 className="text-sm font-semibold text-ink">추가 확인이 필요해요</h3>
          <ul className="mt-2 space-y-1 text-[13px] text-ink-2">
            {data.omittedSpecialContract.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </section>
      )}

      <Button
        variant="gold"
        full
        className="mt-5"
        onClick={() => router.push(`/partner/review/${reportId}`)}
      >
        검수 시작
      </Button>

      <div className="mt-2 flex gap-2">
        <Link
          href={`/customer/report/${reportId}`}
          className={buttonVariants({ variant: "outline", className: "flex-1" })}
        >
          초안 전체 보기
        </Link>
        <Button
          variant="ghost"
          loading={hold.isPending}
          onClick={() => hold.mutate(reportId)}
        >
          보류
        </Button>
      </div>
    </div>
  );
}

function DraftPlaceholder() {
  return (
    <div className="rounded-card-lg border border-dashed border-line bg-paper-2 p-8 text-center text-sm text-ink-3">
      사건을 선택하면 AI 초안을 확인할 수 있어요.
    </div>
  );
}

function DraftSkeleton() {
  return (
    <div className="space-y-3 rounded-card-lg border border-line bg-card p-5">
      <div className="h-6 w-24 animate-pulse rounded bg-line-2" />
      <div className="h-9 w-40 animate-pulse rounded bg-line-2" />
      <div className="h-28 animate-pulse rounded bg-line-2" />
      <div className="h-20 animate-pulse rounded bg-line-2" />
    </div>
  );
}

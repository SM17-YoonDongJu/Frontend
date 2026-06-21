"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useReportDetail } from "@/app/customer/report/[id]/_api/use-report-detail";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { useHoldReview } from "../_api/use-hold-review";
import type { ReviewListItem } from "../_model/types";

const toManwon = (won: number) => Math.round(won / 10_000).toLocaleString("ko-KR");

export function ReviewDraftPanel({ item }: { item: ReviewListItem | null }) {
  return (
    <aside className="lg:sticky lg:top-20">
      {item === null ? (
        <DraftPlaceholder />
      ) : (
        <Suspense fallback={<DraftSkeleton />}>
          <DraftContent item={item} />
        </Suspense>
      )}
    </aside>
  );
}

function DraftContent({ item }: { item: ReviewListItem }) {
  const { data } = useReportDetail(item.reportId);
  const router = useRouter();
  const hold = useHoldReview();

  const offered = data.offeredAmount ?? 0;
  const fillStart = Math.min(95, Math.max(0, Math.round((offered / item.claimedMaxAmount) * 100)));

  const tags = [...new Set(data.issue.map((issue) => issue.tag).filter((tag): tag is string => tag !== null))];

  return (
    <div className="space-y-3">
      {/* 예상 보상 요약 (네이비) */}
      <div className="rounded-card-lg bg-navy p-5 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-pill bg-gold px-2.5 py-1 text-[12.5px] font-semibold">
              {item.accidentType}
            </span>
            <span className="text-xs text-white/70">#{item.caseId}</span>
            <span className="text-xs text-white/70">· {item.region}</span>
          </div>
          <span className="shrink-0 rounded-pill border border-gold/60 px-2.5 py-1 text-[11px] font-semibold text-gold-2">
            AI 초안
          </span>
        </div>

        <p className="mt-4 text-[13px] text-white/60">검토 가능한 예상 보상 범위</p>
        <p className="mt-1 text-[28px] font-bold leading-tight">
          {toManwon(item.claimedMinAmount)} – {toManwon(item.claimedMaxAmount)}
          <span className="ml-1 text-base font-medium text-white/80">만원</span>
        </p>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-white/20">
          <div className="h-full rounded-pill bg-gold" style={{ marginLeft: `${fillStart}%`, width: `${100 - fillStart}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[12px]">
          <span className="text-white/60">제안 {toManwon(offered)}만</span>
          <span className="font-semibold text-gold-2">+ 약 {toManwon(item.offerHeadroom)}만</span>
        </div>
      </div>

      {/* AI 쟁점 (화이트) */}
      <div className="rounded-card-lg border border-line bg-card p-5">
        <h3 className="text-[15px] font-bold text-ink">
          AI가 짚은 쟁점 <span className="text-gold">{data.issue.length}건</span>
        </h3>

        <ol className="mt-3 space-y-3">
          {data.issue.map((issue, index) => (
            <li key={`${issue.title}-${index}`} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-soft text-[12px] font-bold text-gold-ink">
                {index + 1}
              </span>
              <p className="text-[13.5px] leading-relaxed text-ink-2">{issue.title}</p>
            </li>
          ))}
        </ol>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-chip bg-paper-2 px-2.5 py-1 text-[12px] text-ink-2">
                {tag}
              </span>
            ))}
          </div>
        )}

        {data.omittedSpecialContract.length > 0 && (
          <div className="mt-3 rounded-card border border-line-2 bg-paper-2 px-3 py-2 text-[12.5px] text-ink-3">
            {data.omittedSpecialContract.join(" · ")}
          </div>
        )}
      </div>

      {/* 액션 */}
      <Button
        variant="primary"
        full
        size="lg"
        icon={<span aria-hidden>→</span>}
        onClick={() => router.push(`/partner/review/${item.reportId}`)}
      >
        검수 시작
      </Button>

      <div className="flex gap-2">
        <Link
          href={`/customer/report/${item.reportId}`}
          className={buttonVariants({ variant: "outline", className: "flex-1" })}
        >
          초안 전체 보기
        </Link>
        <Button variant="outline" loading={hold.isPending} onClick={() => hold.mutate(item.reportId)}>
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
    <div className="space-y-3">
      <div className="h-44 animate-pulse rounded-card-lg bg-line-2" />
      <div className="h-52 animate-pulse rounded-card-lg bg-line-2" />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { accidentTypeLabel } from "@/shared/model/accident-type";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { toast } from "@/shared/ui/toast";
import { useDraftPreview } from "../_api/use-draft-preview";
import { useHoldReview } from "../_api/use-hold-review";
import type { ReviewListItem } from "../../_shared/model/types";
import { HoldReasonDialog } from "./HoldReasonDialog";

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
  const { data } = useDraftPreview(item.reportId);
  const router = useRouter();
  const hold = useHoldReview();
  const [holdOpen, setHoldOpen] = useState(false);

  const offered = data.offeredAmount ?? 0;
  const fillStart =
    data.claimedMaxAmount > 0
      ? Math.min(95, Math.max(0, Math.round((offered / data.claimedMaxAmount) * 100)))
      : 0;

  const tags = [...new Set(data.issues.flatMap((issue) => issue.tags))];

  return (
    <div className="space-y-3">
      <div className="rounded-card-lg bg-navy p-5 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-pill bg-gold px-2.5 py-1 text-[0.78rem] font-semibold">
              {accidentTypeLabel(item.accidentType)}
            </span>
            {item.caseId && <span className="text-xs text-white/70">#{item.caseId}</span>}
            {item.region && <span className="text-xs text-white/70">· {item.region}</span>}
          </div>
          <span className="shrink-0 rounded-pill border border-gold/60 px-2.5 py-1 text-[0.6875rem] font-semibold text-gold-2">
            AI 초안
          </span>
        </div>

        <p className="mt-4 text-[0.8125rem] text-white/60">검토 가능한 예상 보상 범위</p>
        <p className="mt-1 text-[1.75rem] font-bold leading-tight">
          {toManwon(data.claimedMinAmount)} – {toManwon(data.claimedMaxAmount)}
          <span className="ml-1 text-base font-medium text-white/80">만원</span>
        </p>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-white/20">
          <div
            className="h-full rounded-pill bg-gold"
            style={{ marginLeft: `${fillStart}%`, width: `${100 - fillStart}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-white/60">보험사 제안 {toManwon(offered)}만</span>
          {item.offerHeadroom != null && (
            <span className="font-semibold text-gold-2">+ 약 {toManwon(item.offerHeadroom)}만</span>
          )}
        </div>
      </div>

      <div className="rounded-card-lg border border-line bg-card p-5">
        <h3 className="text-[0.9375rem] font-bold text-ink">
          AI가 짚은 쟁점 <span className="text-gold">{data.issues.length}건</span>
        </h3>

        <ol className="mt-3 space-y-3">
          {data.issues.map((issue, index) => (
            <li key={`${issue.title}-${index}`} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-soft text-xs font-bold text-gold-ink">
                {index + 1}
              </span>
              <p className="text-[0.84rem] leading-relaxed text-ink-2">{issue.title}</p>
            </li>
          ))}
        </ol>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-chip bg-paper-2 px-2.5 py-1 text-xs text-ink-2">
                {tag}
              </span>
            ))}
          </div>
        )}

        {data.omittedSpecialContract.length > 0 && (
          <div className="mt-3 rounded-card border border-line-2 bg-paper-2 px-3 py-2 text-[0.78rem] text-ink-3">
            {data.omittedSpecialContract.join(" · ")}
          </div>
        )}
      </div>

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
        <Button
          variant="outline"
          className="flex-1"
          loading={hold.isPending}
          onClick={() => setHoldOpen(true)}
        >
          보류
        </Button>
      </div>

      <p className="text-center text-xs text-ink-3">
        검수를 시작하면 의뢰인에게 배정 알림이 전송됩니다.
      </p>

      {holdOpen && (
        <HoldReasonDialog
          isPending={hold.isPending}
          onConfirm={(reason, reasonDetail) => {
            hold.mutate(
              { reportId: item.reportId, reason, reasonDetail },
              {
                onSuccess: () => setHoldOpen(false),
                onError: () =>
                  toast.error("사건 보류에 실패했어요. 잠시 후 다시 시도해 주세요."),
              },
            );
          }}
          onClose={() => setHoldOpen(false)}
        />
      )}
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

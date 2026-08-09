import { AmountRange } from "@/shared/ui/AmountRange";
import { Button } from "@/shared/ui/Button";
import { ProgressBar } from "@/shared/ui/ProgressBar";

interface SidebarCounts {
  accepted: number;
  modified: number;
  excluded: number;
}

export interface ReviewSidebarProps {
  progress: { reviewed: number; total: number };
  counts: SidebarCounts;
  confirmedMin: number | null;
  confirmedMax: number | null;
  reflectedIssueCount: number;
  hasOpinion: boolean;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onComplete: () => void;
  onRevert: () => void;
}

const COUNT_ROWS = [
  { key: "accepted", label: "인정", className: "text-ink" },
  { key: "modified", label: "수정", className: "text-gold-ink" },
  { key: "excluded", label: "제외", className: "text-terra" },
] as const;

export function ReviewSidebar({
  progress,
  counts,
  confirmedMin,
  confirmedMax,
  reflectedIssueCount,
  hasOpinion,
  isSubmitting,
  errorMessage,
  onComplete,
  onRevert,
}: ReviewSidebarProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-card-lg border border-line bg-card p-5">
        <h2 className="font-serif text-[1rem] font-bold text-ink">검수 진행</h2>
        <div className="mt-3 flex items-center justify-between text-[0.84375rem]">
          <span className="text-ink-3">쟁점 검토</span>
          <span className="font-semibold tabular-nums text-ink">
            {progress.reviewed}/{progress.total}
          </span>
        </div>
        <ProgressBar
          className="mt-2"
          value={progress.reviewed}
          max={progress.total}
          label="쟁점 검토 진행"
        />
        <dl className="mt-4 space-y-2.5 border-t border-line-2 pt-4 text-[0.875rem]">
          {COUNT_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between">
              <dt className="text-ink-2">{row.label}</dt>
              <dd className={`font-semibold tabular-nums ${row.className}`}>
                {counts[row.key]}건
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-card-lg border border-line bg-card p-5">
        <h2 className="font-serif text-[1rem] font-bold text-ink">고객 전송 요약</h2>
        <dl className="mt-3 space-y-2.5 text-[0.875rem]">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-ink-2">확정 보상 범위</dt>
            <dd>
              {confirmedMin != null ? (
                <AmountRange min={confirmedMin} max={confirmedMax} />
              ) : (
                <span className="text-[0.8125rem] text-ink-3">미입력</span>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-ink-2">반영 쟁점</dt>
            <dd className="font-semibold tabular-nums text-ink">{reflectedIssueCount}건</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-ink-2">사정사 의견</dt>
            <dd className="font-semibold text-ink">{hasOpinion ? "첨부됨" : "미작성"}</dd>
          </div>
        </dl>
      </section>

      <div className="space-y-2.5">
        <Button
          variant="primary"
          size="lg"
          full
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={onComplete}
        >
          검수 완료 · 고객 전송
        </Button>
        <Button variant="ghost" full disabled={isSubmitting} onClick={onRevert}>
          초안으로 되돌리기
        </Button>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-card border border-terra-2 bg-terra-soft px-4 py-3 text-[0.78125rem] leading-relaxed text-terra"
        >
          {errorMessage}
        </p>
      )}

      <p className="rounded-card bg-green-soft px-4 py-3 text-[0.78125rem] leading-relaxed text-green">
        전송 시 손해사정사 검수 완료 배지가 부착되어 고객에게 발송됩니다.
      </p>
    </div>
  );
}

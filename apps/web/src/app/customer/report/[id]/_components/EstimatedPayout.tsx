import { AmountRange } from "@/shared/ui/AmountRange";
import { ConfidenceGauge, type ConfidenceLevel } from "@/shared/ui/ConfidenceGauge";

export interface EstimatedPayoutProps {
  claimedMinAmount: number;
  claimedMaxAmount: number;
  confidenceLevel?: ConfidenceLevel | null;
}

export function EstimatedPayout({
  claimedMinAmount,
  claimedMaxAmount,
  confidenceLevel,
}: EstimatedPayoutProps) {
  return (
    <section className="rounded-card-lg bg-navy p-6 text-white">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="flex items-center gap-1.5 text-[14px] font-semibold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-terra-2" aria-hidden>
              <path d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            검토 보장
          </p>
          <p className="mt-0.5 text-[12px] text-white/50">이 사정서의 검토 범위 · 참고용 추정</p>
        </div>
        {confidenceLevel && (
          <div className="w-[200px] shrink-0">
            <p className="mb-2 text-right text-[11px] text-white/50">분석 신뢰도</p>
            <ConfidenceGauge level={confidenceLevel} />
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <AmountRange
          min={claimedMinAmount}
          max={claimedMaxAmount}
          size="lg"
          className="text-white"
        />
        <p className="max-w-[240px] rounded-card bg-white/10 px-4 py-3 text-[12.5px] leading-relaxed text-white/80">
          확실함 — 현재 자료 기준 단계적으로 검토하는 보수적 범위입니다.
        </p>
      </div>
    </section>
  );
}

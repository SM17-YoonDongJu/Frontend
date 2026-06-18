import { AmountRange } from "@/shared/ui/AmountRange";
import { ConfidenceGauge, type ConfidenceLevel } from "@/shared/ui/ConfidenceGauge";

export interface EstimatedPayoutProps {
  claimedMinAmount: number;
  claimedMaxAmount: number;
  offeredAmount?: number | null;
  confidenceLevel?: ConfidenceLevel | null;
}

export function EstimatedPayout({
  claimedMinAmount,
  claimedMaxAmount,
  offeredAmount,
  confidenceLevel,
}: EstimatedPayoutProps) {
  return (
    <section className="rounded-card-lg bg-navy p-6 text-white">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[14px] font-semibold">검토 보장</p>
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

      {offeredAmount != null && (
        <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4 text-[14px]">
          <span className="text-white/60">보험사 제안 금액</span>
          <AmountRange min={offeredAmount} className="text-white" />
        </div>
      )}
    </section>
  );
}

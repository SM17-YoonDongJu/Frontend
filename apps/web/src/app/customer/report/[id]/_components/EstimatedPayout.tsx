import { AmountRange } from "@/shared/ui/AmountRange";
import { ConfidenceGauge, type ConfidenceLevel } from "@/shared/ui/ConfidenceGauge";

export interface EstimatedPayoutProps {
  claimedMinAmount: number;
  claimedMaxAmount: number;
  offeredAmount?: number | null;
  confidenceLevel?: ConfidenceLevel | null;
  basis?: string | null;
}

export function EstimatedPayout({
  claimedMinAmount,
  claimedMaxAmount,
  offeredAmount,
  confidenceLevel,
  basis,
}: EstimatedPayoutProps) {
  return (
    <section className="overflow-hidden rounded-card-lg border border-line bg-card">
      <div className="bg-navy px-6 py-5">
        <p className="text-[13px] text-white/70">예상 보상 범위</p>
        <div className="mt-1">
          <AmountRange
            min={claimedMinAmount}
            max={claimedMaxAmount}
            size="lg"
            className="text-white"
          />
        </div>
      </div>

      <div className="space-y-4 p-6">
        {confidenceLevel && (
          <div>
            <p className="mb-2 text-[13px] text-ink-3">분석 신뢰도</p>
            <ConfidenceGauge level={confidenceLevel} />
          </div>
        )}

        {offeredAmount != null && (
          <div className="flex items-center justify-between text-[14px]">
            <span className="text-ink-3">보험사 제안 금액</span>
            <AmountRange min={offeredAmount} />
          </div>
        )}

        {basis && <p className="text-[13.5px] leading-relaxed text-ink-2">{basis}</p>}
      </div>
    </section>
  );
}

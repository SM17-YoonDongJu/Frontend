import { AmountRange } from "@/shared/ui/AmountRange";
import { ConfidenceGauge, type ConfidenceLevel } from "@/shared/ui/ConfidenceGauge";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { PayoutRangeBar } from "./PayoutRangeBar";

const WON_PER_MANWON = 10_000;

const toManwon = (won: number) => Math.round(won / WON_PER_MANWON).toLocaleString("ko-KR");

const CONFIDENCE_NOTE: Record<ConfidenceLevel, string> = {
  HIGH: "신뢰도 높음 — 현재 자료 기준 단계적으로 검토하는 보수적 범위입니다.",
  MEDIUM: "신뢰도 보통 — 추가 자료 확보 시 범위가 조정될 수 있어요.",
  LOW: "신뢰도 낮음 — 자료가 부족해 변동 폭이 커요. 자료 보강을 권해요.",
};

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
  const shortfallManwon =
    offeredAmount != null ? Math.round((claimedMinAmount - offeredAmount) / WON_PER_MANWON) : 0;
  const hasShortfall = shortfallManwon > 0;

  return (
    <section className="rounded-card-lg bg-navy p-[1.375rem] text-white lg:p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-terra-2 lg:text-[0.875rem]">
            <AlertTriangle className="text-[1rem]" />
            검토 권장
          </p>
          <p className="mt-0.5 text-[0.75rem] text-white/55">
            검토 가능한 예상 보상 범위 · 참고용 추정
          </p>
        </div>
        {confidenceLevel && (
          <div className="hidden w-[12.5rem] shrink-0 lg:block">
            <p className="mb-2 text-right text-[0.6875rem] text-white/50">분석 신뢰도</p>
            <ConfidenceGauge level={confidenceLevel} />
          </div>
        )}
      </div>

      {/* 모바일: 대형 serif 금액 + 범위 바 + 축 라벨 + 차액 콜아웃 */}
      <div className="mt-4 lg:hidden">
        <p className="font-serif text-[2.0625rem] font-bold leading-tight">
          {toManwon(claimedMinAmount)} – {toManwon(claimedMaxAmount)}
          <span className="ml-1 text-[1.1875rem] font-semibold text-white/70">만원</span>
        </p>

        <div className="mt-4">
          <PayoutRangeBar
            claimedMinAmount={claimedMinAmount}
            claimedMaxAmount={claimedMaxAmount}
            offeredAmount={offeredAmount}
          />
          <div className="mt-2 flex justify-between text-[0.7rem] text-white/45">
            <span>{offeredAmount != null ? "제안받은 금액" : "최소 추정"}</span>
            <span>최대 추정</span>
          </div>
        </div>

        {hasShortfall && (
          <p className="mt-4 rounded-[0.6875rem] bg-white/[.07] px-[0.8125rem] py-[0.6875rem] text-[0.75rem] text-white/80">
            제안 금액이 예상 범위보다{" "}
            <strong className="font-bold text-gold-2">약 {shortfallManwon.toLocaleString("ko-KR")}만원</strong>{" "}
            낮을 수 있어요.
          </p>
        )}
      </div>

      {/* 데스크톱: 기존 룩 유지 */}
      <div className="mt-6 hidden flex-wrap items-end justify-between gap-4 lg:flex">
        <AmountRange min={claimedMinAmount} max={claimedMaxAmount} size="lg" className="text-white" />
        {confidenceLevel && (
          <p className="max-w-[15rem] rounded-card bg-white/10 px-4 py-3 text-[0.78rem] leading-relaxed text-white/80">
            {CONFIDENCE_NOTE[confidenceLevel]}
          </p>
        )}
      </div>
    </section>
  );
}

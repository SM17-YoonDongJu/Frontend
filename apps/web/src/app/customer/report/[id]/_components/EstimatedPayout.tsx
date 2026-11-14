import { AmountRange } from "@/shared/ui/AmountRange";
import { ConfidenceGauge, type ConfidenceLevel } from "@/shared/ui/ConfidenceGauge";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { formatManwon } from "@/shared/lib/format-amount";
import type { ConfidenceNoteView } from "../_model/confidence-note";
import { ConfidenceNote } from "./ConfidenceNote";
import { PayoutRangeBar } from "./PayoutRangeBar";

export interface EstimatedPayoutProps {
  claimedMinAmount: number | null;
  claimedMaxAmount: number | null;
  offeredAmount?: number | null;
  /** 게이지 전용(상세 confidenceLevel). 동작 불변. */
  confidenceLevel?: ConfidenceLevel | null;
  /** 등급 문구·사유 표시 결정 — resolveConfidenceNote 결과. 컴포넌트는 분기를 다시 짜지 않는다. */
  confidenceNote: ConfidenceNoteView;
}

export function EstimatedPayout({
  claimedMinAmount,
  claimedMaxAmount,
  offeredAmount,
  confidenceLevel,
  confidenceNote,
}: EstimatedPayoutProps) {
  const shortfallAmount =
    offeredAmount != null && claimedMinAmount != null ? claimedMinAmount - offeredAmount : null;
  const hasShortfall = shortfallAmount != null && shortfallAmount > 0;

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
          {claimedMinAmount != null && claimedMaxAmount != null ? (
            <>
              {formatManwon(claimedMinAmount)} – {formatManwon(claimedMaxAmount)}
              <span className="ml-1 text-[1.1875rem] font-semibold text-white/70">만원</span>
            </>
          ) : (
            "미산정"
          )}
        </p>

        {claimedMinAmount != null && claimedMaxAmount != null && (
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
        )}

        {hasShortfall && (
          <p className="mt-4 rounded-[0.6875rem] bg-white/[.07] px-[0.8125rem] py-[0.6875rem] text-[0.75rem] text-white/80">
            제안 금액이 예상 범위보다{" "}
            <strong className="font-bold text-gold-2">약 {formatManwon(shortfallAmount ?? 0)}만원</strong>{" "}
            낮을 수 있어요.
          </p>
        )}

        {/* 모바일은 사유가 있을 때만 등급 문구 + 사유 박스(#324 D2). 게이지는 데스크톱 전용 그대로. */}
        {confidenceNote.showMobile && (
          <ConfidenceNote
            note={confidenceNote.note}
            reasons={confidenceNote.reasons}
            className="mt-4"
          />
        )}
      </div>

      {/* 데스크톱: 기존 룩 유지 */}
      <div className="mt-6 hidden flex-wrap items-end justify-between gap-4 lg:flex">
        {claimedMinAmount != null && claimedMaxAmount != null ? (
          <AmountRange min={claimedMinAmount} max={claimedMaxAmount} size="lg" className="text-white" />
        ) : (
          <p className="font-serif text-[1.5rem] font-bold">미산정</p>
        )}
        {confidenceNote.showDesktop && (
          <ConfidenceNote
            note={confidenceNote.note}
            reasons={confidenceNote.reasons}
            className="max-w-[15rem]"
          />
        )}
      </div>
    </section>
  );
}

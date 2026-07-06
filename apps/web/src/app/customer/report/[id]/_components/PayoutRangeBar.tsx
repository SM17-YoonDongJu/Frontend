const WON_PER_MANWON = 10_000;
const AXIS_MIN_PADDING = 0.9;
const AXIS_MAX_PADDING = 1.05;

const toManwon = (won: number) => Math.round(won / WON_PER_MANWON).toLocaleString("ko-KR");

export interface PayoutRangeBarProps {
  claimedMinAmount: number;
  claimedMaxAmount: number;
  offeredAmount?: number | null;
}

/**
 * 예상 보상 범위 시각화 바(히어로 전용). 트랙 위에 예상범위 fill + 제안금액 마커를 그린다.
 * 축은 제안금액이 범위 밖 왼쪽에 놓일 수 있어 패딩 스케일(하한 0.9배·상한 1.05배)로 상대 위치를 보존한다.
 */
export function PayoutRangeBar({
  claimedMinAmount,
  claimedMaxAmount,
  offeredAmount,
}: PayoutRangeBarProps) {
  const hasOffer = offeredAmount != null;
  const axisMin = Math.min(offeredAmount ?? claimedMinAmount, claimedMinAmount) * AXIS_MIN_PADDING;
  const axisMax = claimedMaxAmount * AXIS_MAX_PADDING;
  const axisSpan = axisMax - axisMin || 1;
  const toPercent = (value: number) =>
    Math.min(Math.max(((value - axisMin) / axisSpan) * 100, 0), 100);

  const fillLeft = toPercent(claimedMinAmount);
  const fillWidth = toPercent(claimedMaxAmount) - fillLeft;
  const markerLeft = hasOffer ? toPercent(offeredAmount) : 0;

  return (
    <div>
      {hasOffer && (
        <div className="relative mb-1.5 h-4">
          <span
            className="absolute -translate-x-1/2 whitespace-nowrap text-[0.7rem] font-medium text-white/70"
            style={{ left: `${markerLeft}%` }}
          >
            제안 {toManwon(offeredAmount)}만
          </span>
        </div>
      )}

      <div className="relative h-2.5 rounded-[0.375rem] bg-line-2">
        <div
          className="absolute inset-y-0 rounded-[0.375rem] bg-gold opacity-85"
          style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
        />
        {hasOffer && (
          <span
            className="absolute top-1/2 h-5 w-[0.15625rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
            style={{ left: `${markerLeft}%` }}
          />
        )}
      </div>
    </div>
  );
}

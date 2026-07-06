function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function toManwon(won: number): string {
  return Math.round(won / 10_000).toLocaleString("ko-KR");
}

interface OfferRangeBarProps {
  min: number;
  max: number;
  /** 보험사 제안금액(원). null이면 제안 마커를 표시하지 않는다. */
  offeredAmount: number | null;
}

// 값 축 도메인은 0~max: 골드 밴드가 예상 범위(min~max) 구간만 채우고,
// 제안 마커는 범위보다 낮으면 밴드 왼쪽 바깥(트랙 위)에 선다.
// 라벨 폭 근사값(HALF_LABEL)으로 좌우를 클램프해 카드 밖 삐져나감을 막는다.
const HALF_LABEL = "1.75rem";

export function OfferRangeBar({ min, max, offeredAmount }: OfferRangeBarProps) {
  const hasBand = max > 0 && min < max;
  const bandStartRatio = hasBand ? clamp01(min / max) : 0;
  const hasMarker = offeredAmount !== null && max > 0;
  const markerRatio = hasMarker ? clamp01(offeredAmount / max) : 0;
  const markerPercent = `${markerRatio * 100}%`;

  return (
    <div className="relative h-2.5">
      <div className="relative h-2.5 overflow-hidden rounded-pill bg-line-2">
        {hasBand && (
          <div
            className="absolute inset-y-0 right-0 rounded-pill bg-gold opacity-85"
            style={{ left: `${bandStartRatio * 100}%` }}
          />
        )}
      </div>

      {hasMarker && (
        <>
          <span
            className="absolute bottom-[1.0625rem] whitespace-nowrap text-[0.6875rem] font-bold text-ink"
            style={{
              left: `clamp(0rem, calc(${markerPercent} - ${HALF_LABEL}), calc(100% - ${HALF_LABEL} * 2))`,
            }}
          >
            제안 {toManwon(offeredAmount)}만
          </span>
          <span
            className="absolute top-[-0.3125rem] block h-5 w-[0.1875rem] -translate-x-1/2 rounded-[0.125rem] bg-ink"
            style={{ left: `clamp(0.375rem, ${markerPercent}, calc(100% - 0.375rem))` }}
          />
        </>
      )}
    </div>
  );
}

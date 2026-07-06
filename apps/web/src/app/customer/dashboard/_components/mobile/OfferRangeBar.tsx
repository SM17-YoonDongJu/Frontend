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

export function OfferRangeBar({ min, max, offeredAmount }: OfferRangeBarProps) {
  const span = max - min;
  const hasMarker = offeredAmount !== null && span > 0;
  const markerRatio = hasMarker ? clamp01((offeredAmount - min) / span) : 0;

  return (
    <div className="relative h-2.5">
      <div className="h-2.5 overflow-hidden rounded-pill bg-line-2">
        <div className="h-full rounded-pill bg-gold opacity-85" />
      </div>

      {hasMarker && (
        <div
          className="absolute top-[-0.3125rem] -translate-x-1/2"
          style={{ left: `clamp(0.375rem, ${markerRatio * 100}%, calc(100% - 0.375rem))` }}
        >
          <span className="absolute bottom-[1.375rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.6875rem] font-bold text-ink">
            제안 {toManwon(offeredAmount)}만
          </span>
          <span className="block h-5 w-[0.1875rem] rounded-[0.125rem] bg-ink" />
        </div>
      )}
    </div>
  );
}

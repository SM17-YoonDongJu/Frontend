/** 타임라인 단계 사이를 잇는 선. 지나온 구간은 골드. */
export function TimelineConnector({ reached }: { reached: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute right-1/2 top-3 z-0 h-px w-full md:top-[0.9375rem] ${reached ? "bg-gold-2" : "bg-line"}`}
    />
  );
}

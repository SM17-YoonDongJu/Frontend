const WON_PER_MANWON = 10_000;
const toManwon = (won: number) => Math.round(won / WON_PER_MANWON).toLocaleString("ko-KR");

export interface CaseSummaryCardProps {
  adjusterName: string;
  subtitle: string;
  confirmedAmount: number | null;
}

export function CaseSummaryCard({ adjusterName, subtitle, confirmedAmount }: CaseSummaryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-line-2 bg-paper-2 p-4 lg:p-[1.125rem]">
      <div className="flex size-[3.25rem] shrink-0 items-center justify-center rounded-full bg-navy font-serif text-[1.3125rem] text-white">
        {[...adjusterName][0] ?? "?"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[1rem] font-bold text-ink">{adjusterName}</span>
          <span className="shrink-0 rounded-pill bg-green-soft px-2.5 py-0.5 text-[0.6875rem] font-bold text-green">
            사건 종결
          </span>
        </div>
        <p className="mt-1 truncate text-[0.8125rem] text-ink-3">{subtitle}</p>
      </div>
      {confirmedAmount != null && (
        <div className="hidden shrink-0 flex-col items-end lg:flex">
          <span className="text-[0.75rem] text-ink-3">확정 보상금</span>
          <span className="font-serif text-[1.1875rem] font-bold text-gold-ink">{toManwon(confirmedAmount)}만 원</span>
        </div>
      )}
    </div>
  );
}

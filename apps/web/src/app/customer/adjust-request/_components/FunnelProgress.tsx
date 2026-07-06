import { cn } from "@/shared/lib/utils";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";

interface FunnelProgressProps {
  current: number;
  total: number;
  title: string;
  isFirst?: boolean;
  onBack?: () => void;
}

/**
 * 상단 진행 표시.
 * - 모바일: 뒤로가기 + 연속 진행바 + n/total
 * - 데스크톱: STEP n/total + 분할 진행바 + 단계 라벨
 */
export function FunnelProgress({ current, total, title, isFirst, onBack }: FunnelProgressProps) {
  const filledRatio = Math.min(current / total, 1);

  return (
    <div>
      <div
        className="flex items-center gap-3 sm:hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <button
          type="button"
          onClick={onBack}
          disabled={isFirst}
          aria-label="이전 단계"
          className="-ml-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-paper-2 disabled:opacity-[.35]"
        >
          <ChevronRight className="rotate-180 text-[1.375rem]" />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-line">
          <div
            className="h-full rounded-pill bg-gold transition-[width]"
            style={{ width: `${filledRatio * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-[0.8125rem] font-medium text-ink-3">
          {current}/{total}
        </span>
      </div>

      <div className="hidden sm:block">
        <div className="mb-3 flex items-center justify-between text-[0.8125rem]">
          <span className="font-semibold text-ink">
            STEP <span className="text-gold-ink">{current}</span> / {total}
          </span>
          <span className="text-ink-3">{title}</span>
        </div>
        <div
          className="flex gap-1.5"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
        >
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-pill transition-colors",
                i < current ? "bg-gold" : "bg-line",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

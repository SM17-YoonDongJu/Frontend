import { cn } from "@/shared/lib/utils";

interface FunnelProgressProps {
  current: number;
  total: number;
  title: string;
}

/** STEP n/6 + 분할 진행바 + 우측 단계 라벨. */
export function FunnelProgress({ current, total, title }: FunnelProgressProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-[13px]">
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
  );
}

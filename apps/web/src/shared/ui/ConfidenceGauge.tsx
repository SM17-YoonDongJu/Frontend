import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

const LEVEL_META: Record<ConfidenceLevel, { percent: number; label: string }> = {
  LOW: { percent: 30, label: "낮음" },
  MEDIUM: { percent: 60, label: "보통" },
  HIGH: { percent: 88, label: "높음" },
};

export interface ConfidenceGaugeProps extends HTMLAttributes<HTMLDivElement> {
  level: ConfidenceLevel;
  showLabel?: boolean;
}

export function ConfidenceGauge({ level, showLabel = true, className, ...props }: ConfidenceGaugeProps) {
  const { percent, label } = LEVEL_META[level];

  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <div className="relative h-2 flex-1 rounded-pill bg-gradient-to-r from-paper-2 via-gold-soft to-gold">
        <span
          className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-ink shadow-sm"
          style={{ left: `${percent}%` }}
        />
      </div>
      {showLabel && <span className="shrink-0 text-[13px] font-semibold text-ink">{label}</span>}
    </div>
  );
}

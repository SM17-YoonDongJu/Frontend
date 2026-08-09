import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

export type ConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

const LEVEL_META: Record<ConfidenceLevel, { percent: number; label: string }> = {
  LOW: { percent: 35, label: "낮음" },
  MEDIUM: { percent: 65, label: "보통" },
  HIGH: { percent: 90, label: "높음" },
};

export interface ConfidenceGaugeProps extends HTMLAttributes<HTMLDivElement> {
  level: ConfidenceLevel;
  showLabel?: boolean;
}

export function ConfidenceGauge({ level, showLabel = true, className, ...props }: ConfidenceGaugeProps) {
  const { percent, label } = LEVEL_META[level];

  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <div className="h-2 flex-1 overflow-hidden rounded-pill bg-line-2">
        <div
          className="h-full rounded-pill bg-gradient-to-r from-gold-2 to-gold"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && <span className="shrink-0 text-[0.8125rem] font-semibold">{label}</span>}
    </div>
  );
}

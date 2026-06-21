import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

const TONE_FILL = {
  gold: "bg-gold",
  navy: "bg-navy",
  green: "bg-green",
} as const;

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
  value: number;
  max: number;
  tone?: keyof typeof TONE_FILL;
  /** 접근성 라벨 (예: "쟁점 검토 진행") */
  label?: string;
}

export function ProgressBar({
  value,
  max,
  tone = "gold",
  label,
  className,
  ...props
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const ratio = Math.min(Math.max(value / safeMax, 0), 1);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("h-2 w-full overflow-hidden rounded-pill bg-line-2", className)}
      {...props}
    >
      <div
        className={cn("h-full rounded-pill transition-[width] duration-300", TONE_FILL[tone])}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}

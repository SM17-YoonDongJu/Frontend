import { type LabelHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** true면 골드 대문자 키커, 아니면 인풋 라벨 */
  kicker?: boolean;
}

export function Label({ kicker, className, children, ...props }: LabelProps) {
  if (kicker) {
    return (
      <div className={cn("text-[12.5px] font-semibold uppercase tracking-[0.12em] text-gold-ink", className)}>
        {children}
      </div>
    );
  }
  return (
    <label className={cn("text-[13.5px] font-semibold text-ink-2", className)} {...props}>
      {children}
    </label>
  );
}

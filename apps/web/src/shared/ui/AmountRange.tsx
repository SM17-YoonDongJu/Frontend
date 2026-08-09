import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";
import { formatManwon, formatManwonRange } from "@/shared/lib/format-amount";

const amountVariants = cva("font-semibold tabular-nums text-ink", {
  variants: {
    size: {
      md: "text-[0.9375rem]",
      lg: "text-[1.75rem] leading-tight",
    },
  },
  defaultVariants: { size: "md" },
});

export interface AmountRangeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof amountVariants> {
  min: number;
  max?: number | null;
}

export function AmountRange({ min, max, size, className, ...props }: AmountRangeProps) {
  const text = max != null ? formatManwonRange(min, max) : `${formatManwon(min)}만원`;

  return (
    <span className={cn(amountVariants({ size }), className)} {...props}>
      {text}
    </span>
  );
}

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

const amountVariants = cva("font-semibold tabular-nums text-ink", {
  variants: {
    size: {
      md: "text-[15px]",
      lg: "text-[28px] leading-tight",
    },
  },
  defaultVariants: { size: "md" },
});

const toManwon = (won: number) => Math.round(won / 10_000).toLocaleString("ko-KR");

export interface AmountRangeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof amountVariants> {
  min: number;
  max?: number | null;
}

export function AmountRange({ min, max, size, className, ...props }: AmountRangeProps) {
  const text =
    max != null && max !== min ? `${toManwon(min)}~${toManwon(max)}만원` : `${toManwon(min)}만원`;

  return (
    <span className={cn(amountVariants({ size }), className)} {...props}>
      {text}
    </span>
  );
}

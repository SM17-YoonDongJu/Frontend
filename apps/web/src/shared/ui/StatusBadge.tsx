import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex select-none items-center gap-1 whitespace-nowrap rounded-pill px-2.5 py-1 text-[0.78125rem] font-semibold leading-none",
  {
    variants: {
      tone: {
        neutral: "bg-paper-2 text-ink-2",
        navy: "bg-navy text-white",
        gold: "bg-gold-soft text-gold-ink",
        green: "bg-green-soft text-green",
        terra: "bg-terra-soft text-terra",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface StatusBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: ReactNode;
}

export function StatusBadge({ className, tone, icon, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
}

export { badgeVariants };

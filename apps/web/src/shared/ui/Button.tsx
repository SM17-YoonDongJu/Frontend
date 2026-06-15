import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-button font-semibold transition hover:brightness-[.96] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold-soft disabled:cursor-not-allowed disabled:opacity-[.42]",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white",
        gold: "bg-gold text-white",
        outline: "border border-line bg-transparent text-ink",
        ghost: "bg-paper text-ink",
        danger: "bg-terra text-white"
      },
      size: {
        sm: "px-[14px] py-2 text-[13.5px]",
        md: "px-[18px] py-3 text-[15px]",
        lg: "px-[22px] py-[15px] text-[16px]"
      },
      full: { true: "w-full" }
    },
    defaultVariants: { variant: "primary", size: "md" }
  }
);

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="1.1em"
      height="1.1em"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 로딩 중 스피너 표시 + 클릭 잠금 (아이콘 숨김) */
  loading?: boolean;
  /** 우측 아이콘 (ReactNode — 소비처가 아이콘을 넘긴다) */
  icon?: ReactNode;
  /** 좌측 아이콘 */
  iconLeft?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, full, loading, icon, iconLeft, disabled, children, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, full }), className)}
      {...props}
    >
      {loading && <Spinner />}
      {!loading && iconLeft}
      {children}
      {!loading && icon}
    </button>
  );
});

export { buttonVariants };

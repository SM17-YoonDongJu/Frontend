import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** 체크박스 + 라벨. */
export function Checkbox({ checked, onChange, label, disabled, className }: CheckboxProps) {
  return (
    <label
      className={cn(
        "relative inline-flex cursor-pointer select-none items-center gap-2.5 text-[0.875rem] text-ink",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className={cn(
          "flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-[0.3125rem] border transition",
          checked ? "border-ink bg-ink text-white" : "border-line bg-card",
        )}
      >
        {checked && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

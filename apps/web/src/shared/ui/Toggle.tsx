"use client";

import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** 스위치 토글(role="switch") + 라벨. */
export function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "group inline-flex cursor-pointer select-none items-center gap-2.5 text-sm text-ink focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          "flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition group-focus-visible:ring-[3px] group-focus-visible:ring-gold-soft",
          checked ? "bg-green" : "bg-line",
        )}
      >
        <span
          className={cn(
            "size-5 rounded-full bg-card shadow-sm transition",
            checked && "translate-x-5",
          )}
        />
      </span>
    </button>
  );
}

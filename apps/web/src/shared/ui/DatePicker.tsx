"use client";

import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { cn } from "@/shared/lib/utils";

interface DatePickerProps {
  /** YYYY-MM-DD */
  value?: string;
  onChange: (value: string | null) => void;
  placeholder?: string;
  error?: string;
  /** 래퍼 클래스 */
  className?: string;
  fromDate?: Date;
  toDate?: Date;
}

function toISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromISO(value?: string) {
  return value ? new Date(`${value}T00:00:00`) : undefined;
}

function formatLabel(value?: string) {
  return value ? value.replace(/-/g, ".") : "";
}

/** 팝오버 달력 입력. value/onChange는 YYYY-MM-DD 문자열. */
export function DatePicker({
  value,
  onChange,
  placeholder = "날짜 선택",
  error,
  className,
  fromDate,
  toDate,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const selected = fromISO(value);

  return (
    <div className={cn("relative flex flex-col gap-[0.4375rem]", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-[2.875rem] items-center justify-between rounded-input border bg-card px-3.5 text-[0.90625rem] outline-none transition focus:border-gold focus:ring-[3px] focus:ring-gold-soft",
          error ? "border-terra" : "border-line",
          value ? "text-ink" : "text-ink-3",
        )}
      >
        {value ? formatLabel(value) : placeholder}
        <CalendarGlyph />
      </button>

      {open && (
        <div className="absolute top-[3.25rem] z-20 rounded-card border border-line bg-card p-2 shadow-lg">
          <DayPicker
            mode="single"
            locale={ko}
            defaultMonth={selected}
            selected={selected}
            onSelect={(date) => {
              onChange(date ? toISO(date) : null);
              setOpen(false);
            }}
            startMonth={fromDate}
            endMonth={toDate}
            disabled={[fromDate ? { before: fromDate } : undefined, toDate ? { after: toDate } : undefined].filter(Boolean) as never}
            style={
              {
                "--rdp-accent-color": "var(--color-gold)",
                "--rdp-accent-background-color": "var(--color-gold-soft)",
              } as React.CSSProperties
            }
          />
        </div>
      )}

      {error && <span className="text-[0.75rem] font-medium text-terra">{error}</span>}
    </div>
  );
}

function CalendarGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-ink-3">
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

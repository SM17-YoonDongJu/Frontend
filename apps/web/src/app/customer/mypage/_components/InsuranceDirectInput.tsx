"use client";

import { forwardRef, useState, type FormEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { Search } from "@/shared/ui/icons/Search";
import { Upload } from "@/shared/ui/icons/Upload";

interface InsuranceDirectInputProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

/** 보험 직접 입력 행 — 텍스트 입력 + 증권 자동 등록(진입점). */
export const InsuranceDirectInput = forwardRef<
  HTMLInputElement,
  InsuranceDirectInputProps
>(function InsuranceDirectInput({ onSubmit, disabled, className }, ref) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-3 rounded-input border border-line bg-paper-2 px-4 py-2.5",
        className,
      )}
    >
      <Search className="size-[1.0625rem] shrink-0 text-ink-3" />
      <input
        ref={ref}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="보험사 · 상품명 직접 입력"
        className="min-w-0 flex-1 bg-transparent text-[0.875rem] text-ink outline-none placeholder:text-ink-3"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-button border border-line bg-card px-3.5 py-2 text-[0.8125rem] font-bold text-ink transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-[.42]"
      >
        증권으로 자동 등록
        <Upload className="size-[0.9375rem]" />
      </button>
    </form>
  );
});

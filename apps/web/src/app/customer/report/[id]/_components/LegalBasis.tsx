"use client";

import { useId, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { FileText } from "@/shared/ui/icons/FileText";

export interface LegalBasisProps {
  items: string[];
}

export function LegalBasis({ items }: LegalBasisProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  if (!items.length) return null;

  return (
    <section className="rounded-card border border-line bg-card lg:rounded-card-lg lg:bg-paper-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={listId}
        className="flex w-full items-center justify-between px-[1.125rem] py-[0.9375rem] text-left lg:pointer-events-none lg:cursor-default lg:px-6 lg:pb-0 lg:pt-6"
      >
        <span className="text-[0.9rem] font-bold text-ink lg:text-[0.9375rem] lg:font-semibold lg:text-ink-2">
          근거 약관 · 판례
        </span>
        <ChevronDown
          className={cn(
            "text-[1.125rem] text-ink-3 transition-transform lg:hidden",
            open && "rotate-180",
          )}
        />
      </button>

      <ul id={listId} className={cn(open ? "block" : "hidden", "pb-1.5 lg:block lg:pb-6")}>
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 border-t border-line-2 px-[1.125rem] py-[0.8125rem] text-[0.77rem] leading-[1.22rem] text-ink-2 lg:border-none lg:px-6 lg:py-0.5 lg:text-[0.8125rem] lg:text-ink-3"
          >
            <FileText className="mt-0.5 shrink-0 text-[0.9375rem] text-ink-3 lg:hidden" />
            <span className="hidden lg:inline">※ </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

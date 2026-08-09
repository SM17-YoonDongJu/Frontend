import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: ReactNode;
  caption: string;
}) {
  return (
    <div className="flex flex-col rounded-card border border-line bg-card p-3.5 text-center shadow-sm md:p-[1.3125rem] md:text-left">
      <p className="order-2 mt-1 text-[0.75rem] font-medium text-ink-3 md:order-none md:mt-0">
        {label}
      </p>
      <p className="order-1 font-serif text-[1.25rem] font-bold tabular-nums text-ink md:order-none md:mt-1 md:text-[1.625rem]">
        {value}
      </p>
      <p className="order-3 mt-1 hidden text-[0.6875rem] text-ink-3 md:block">{caption}</p>
    </div>
  );
}

import type { ReactNode } from "react";

export function AdjusterStat({
  label,
  value,
  caption,
  inset,
}: {
  label: string;
  value: ReactNode;
  caption: string;
  inset?: boolean;
}) {
  return (
    <div className={inset ? "pl-3 sm:pl-6" : undefined}>
      <dt className="text-xs text-ink-3">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{value}</dd>
      <p className="mt-1 text-xs text-ink-3">{caption}</p>
    </div>
  );
}

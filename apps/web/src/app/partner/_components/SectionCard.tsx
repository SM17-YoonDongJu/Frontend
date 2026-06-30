import type { ReactNode } from "react";
import Link from "next/link";
import { Chevron } from "@/shared/ui/icons/Chevron";
import { cn } from "@/shared/lib/utils";

interface Props {
  title: string;
  count?: string;
  action?: { label: string; href: string };
  className?: string;
  children: ReactNode;
}

export function SectionCard({ title, count, action, className, children }: Props) {
  return (
    <section className={cn("rounded-card-lg border border-line bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
          {count && <span className="text-[13px] font-semibold text-gold-ink">{count}</span>}
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium text-ink-3 transition hover:text-ink"
          >
            {action.label}
            <Chevron />
          </Link>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

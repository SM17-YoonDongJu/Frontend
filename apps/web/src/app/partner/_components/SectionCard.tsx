import type { ReactNode } from "react";
import Link from "next/link";
import { Chevron } from "@/shared/ui/icons/Chevron";
import { cn } from "@/shared/lib/utils";

interface Props {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
  children: ReactNode;
}

export function SectionCard({ title, description, action, className, children }: Props) {
  return (
    <section className={cn("rounded-card-lg border border-line bg-card p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
          {description && <p className="mt-1 text-[13px] text-ink-3">{description}</p>}
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex shrink-0 items-center gap-0.5 text-[13px] font-medium text-ink-2 transition hover:text-ink"
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

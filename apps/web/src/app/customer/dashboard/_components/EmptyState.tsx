import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/shared/ui/Button";

interface EmptyStateProps {
  icon?: ReactNode;
  message: string;
  cta?: { label: string; href: string };
}

export function EmptyState({ icon, message, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-line bg-paper-2 px-6 py-10 text-center">
      {icon && <div className="mb-2 text-ink-3">{icon}</div>}
      <p className="text-[0.875rem] text-ink-2">{message}</p>
      {cta && (
        <Link
          href={cta.href}
          className={buttonVariants({ variant: "gold", size: "sm", className: "mt-4" })}
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

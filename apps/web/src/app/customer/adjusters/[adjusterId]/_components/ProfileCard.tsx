import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface ProfileCardProps {
  title: ReactNode;
  titleExtra?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ProfileCard({ title, titleExtra, children, className }: ProfileCardProps) {
  return (
    <section className={cn("rounded-card-lg border border-line bg-card p-7", className)}>
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {titleExtra}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

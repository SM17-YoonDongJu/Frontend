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
    <section
      className={cn("rounded-card border border-line bg-card p-5 lg:rounded-card-lg lg:p-7", className)}
    >
      <div className="flex items-center gap-2">
        <h2 className="text-[0.9375rem] font-semibold text-ink lg:text-lg">{title}</h2>
        {titleExtra}
      </div>
      <div className="mt-3 lg:mt-5">{children}</div>
    </section>
  );
}

import type { ReactNode } from "react";

interface FormCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormCard({ title, description, children }: FormCardProps) {
  return (
    <section className="flex flex-col gap-5 rounded-card border border-line bg-card p-7 md:p-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[1.0625rem] font-bold text-ink">{title}</h2>
        {description && <p className="text-[0.78125rem] text-ink-3">{description}</p>}
      </div>
      {children}
    </section>
  );
}

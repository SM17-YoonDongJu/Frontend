import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";

interface MenuRowProps {
  icon: ReactNode;
  title: string;
  description?: string;
  badge?: string;
  href?: string;
  onClick?: () => void;
}

/** 마이페이지 메뉴 행 — href면 Link, 아니면 button 단일 인터랙티브 요소. */
export function MenuRow({ icon, title, description, badge, href, onClick }: MenuRowProps) {
  const content = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-card bg-paper text-[1.25rem] text-ink-2">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[0.9375rem] font-semibold text-ink">{title}</span>
        {description && (
          <span className="mt-0.5 block text-[0.8125rem] text-ink-3">{description}</span>
        )}
      </span>
      {badge && (
        <span className="rounded-pill bg-gold-soft px-2.5 py-1 text-[0.75rem] font-semibold text-gold-ink">
          {badge}
        </span>
      )}
      <ChevronRight className="shrink-0 text-[1.0625rem] text-ink-3" />
    </>
  );

  const rowClassName =
    "flex w-full items-center gap-4 rounded-card-lg border border-line bg-card px-4.5 py-4 shadow-sm transition hover:bg-paper-2 md:rounded-none md:border-0 md:bg-transparent md:px-5.5 md:py-4.5 md:shadow-none";

  if (href) {
    return (
      <Link href={href} className={rowClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={rowClassName}>
      {content}
    </button>
  );
}

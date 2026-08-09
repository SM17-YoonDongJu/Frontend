import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

/** 프로필이 있으면 사정사 프로필 링크로, 없으면 링크 없이 같은 레이아웃으로 감싼다. */
export function AdjusterProfileLink({
  href,
  children,
}: {
  href: string | null;
  children: ReactNode;
}) {
  const layout = "flex items-center gap-3";
  if (!href) return <div className={layout}>{children}</div>;

  return (
    <Link href={href} className={cn(layout, "transition hover:opacity-80")}>
      {children}
    </Link>
  );
}

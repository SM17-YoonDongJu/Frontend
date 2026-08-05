import Link from "next/link";
import type { ReactNode } from "react";

/** href가 있으면 아바타·이름 묶음을 프로필 링크로, 없으면(partner) 헤더 flex에 그대로 편다. */
export function ChatProfileLink({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <>{children}</>;

  return (
    <Link
      href={href}
      className="flex min-w-0 flex-1 items-center gap-2.5 transition hover:opacity-80"
    >
      {children}
    </Link>
  );
}

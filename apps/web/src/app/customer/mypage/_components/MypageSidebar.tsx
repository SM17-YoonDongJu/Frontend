"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { useActivitySummary } from "../_api/use-activity-summary";
import { MYPAGE_SIDEBAR_LINKS, type MypageSidebarLink } from "../_model/mypage-links";
import { useLogout } from "@/shared/api/use-logout";
import { cn } from "@/shared/lib/utils";
import { FileText } from "@/shared/ui/icons/FileText";
import { Home } from "@/shared/ui/icons/Home";
import { MessageCircle } from "@/shared/ui/icons/MessageCircle";
import { MessageSquare } from "@/shared/ui/icons/MessageSquare";

type IconComponent = ComponentType<{ className?: string }>;

const ICON_BY_KEY: Record<MypageSidebarLink["key"], IconComponent> = {
  dashboard: Home,
  reports: FileText,
  proposals: MessageSquare,
  consult: MessageCircle,
};

/** PC 사이드바 — 메뉴 4종(카운트 배지) + 로그아웃. */
export function MypageSidebar() {
  const { data: counts } = useActivitySummary();

  return (
    <nav className="rounded-card border border-line bg-card p-2.5 shadow-[0_1px_1px_rgba(21,32,46,0.03)]">
      <ul className="flex flex-col gap-0.5">
        {MYPAGE_SIDEBAR_LINKS.map((link) => {
          const Icon = ICON_BY_KEY[link.key];
          const count = link.countField ? counts[link.countField] : undefined;

          return (
            <li key={link.key}>
              <Link
                href={link.href}
                className="flex items-center gap-2.5 rounded-button px-3 py-2.5 transition hover:bg-paper"
              >
                <Icon className="size-[1.1875rem] text-ink-3" />
                <span className="flex-1 text-[0.875rem] font-medium text-ink-2">
                  {link.label}
                </span>
                {count !== undefined && count > 0 && (
                  <span
                    className={cn(
                      "inline-flex min-w-5.75 justify-center rounded-full px-2 py-0.5 text-[0.6875rem] font-bold",
                      link.emphasis
                        ? "bg-terra text-white"
                        : "bg-paper-2 text-ink-3",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-2 flex flex-col gap-0.5 border-t border-line-2 pt-2">
        <LogoutButton />
        <Link
          href="/withdraw"
          className="rounded-button px-3 py-2.5 text-[0.8125rem] text-ink-3 transition hover:bg-paper hover:text-ink-2"
        >
          회원 탈퇴
        </Link>
      </div>
    </nav>
  );
}

/** 로그아웃 — 세션 종료 후 로그인 화면으로 이동(#155). */
function LogoutButton() {
  const { mutate: logout, isPending } = useLogout();

  return (
    <button
      type="button"
      onClick={() => logout()}
      disabled={isPending}
      className="w-full rounded-button px-3 py-2.5 text-left text-[0.875rem] font-medium text-ink-3 transition hover:bg-paper hover:text-ink-2 disabled:opacity-50"
    >
      로그아웃
    </button>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { useAuthStatus } from "@/shared/api/use-auth-status";
import { cn } from "@/shared/lib/utils";
import type { UserType } from "@/shared/model/user";
import { Chat } from "@/shared/ui/icons/Chat";
import { FileText } from "@/shared/ui/icons/FileText";
import { Home } from "@/shared/ui/icons/Home";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";
import { User } from "@/shared/ui/icons/User";

type IconComponent = ComponentType<{ className?: string }>;
type TabVariant = "customer" | "partner";

interface Tab {
  label: string;
  href: string;
  Icon: IconComponent;
}

const CUSTOMER_TABS: Tab[] = [
  { label: "홈", href: "/customer/dashboard", Icon: Home },
  { label: "리포트", href: "/customer/proposals", Icon: FileText },
  { label: "채팅", href: "/customer/chat", Icon: Chat },
  { label: "내정보", href: "/customer/mypage", Icon: User },
];

const PARTNER_TABS: Tab[] = [
  { label: "홈", href: "/partner", Icon: Home },
  { label: "검수", href: "/partner/review", Icon: ShieldCheck },
  { label: "채팅", href: "/partner/chat", Icon: Chat },
  { label: "내정보", href: "/partner/mypage", Icon: User },
];

const TABS_BY_VARIANT: Record<TabVariant, Tab[]> = {
  customer: CUSTOMER_TABS,
  partner: PARTNER_TABS,
};

const REQUIRED_USER_TYPE: Record<TabVariant, UserType> = {
  customer: "insured_person",
  partner: "adjuster",
};

/**
 * 앱(WebView) 전용 역할별 하단 탭바.
 * 로그인·역할 확정 + 현재 경로가 탭 href와 정확히 일치할 때만 노출(default-hide).
 */
export function AppTabBar({ variant }: { variant: TabVariant }) {
  const pathname = usePathname();
  const auth = useAuthStatus();
  const tabs = TABS_BY_VARIANT[variant];

  const isRoleMatched =
    auth.status === "authenticated" && auth.me.userType === REQUIRED_USER_TYPE[variant];
  const isTabRoute = tabs.some((tab) => tab.href === pathname);
  if (!isRoleMatched || !isTabRoute) return null;

  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-line bg-paper-2/[0.92] pb-[max(env(safe-area-inset-bottom),var(--app-inset-bottom))] backdrop-blur">
      {tabs.map(({ label, href, Icon }) => {
        const isActive = href === pathname;
        return (
          <Link
            key={label}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className="flex h-14 flex-1 flex-col items-center justify-center gap-0.5"
          >
            <Icon className={cn("size-[1.375rem]", isActive ? "text-ink" : "text-ink-3")} />
            <span
              className={cn(
                "text-[0.6875rem]",
                isActive ? "font-bold text-ink" : "font-medium text-ink-3",
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

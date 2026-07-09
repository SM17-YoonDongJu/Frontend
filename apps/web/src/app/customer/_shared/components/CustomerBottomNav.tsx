import Link from "next/link";
import type { ComponentType } from "react";
import { cn } from "@/shared/lib/utils";
import { Chat } from "@/shared/ui/icons/Chat";
import { Home } from "@/shared/ui/icons/Home";
import { TrendingUp } from "@/shared/ui/icons/TrendingUp";
import { User } from "@/shared/ui/icons/User";

type IconComponent = ComponentType<{ className?: string }>;

const TABS: { label: string; href: string; Icon: IconComponent }[] = [
  { label: "홈", href: "/customer/dashboard", Icon: Home },
  { label: "분석", href: "/customer/adjust-request", Icon: TrendingUp },
  { label: "상담", href: "/customer/proposals", Icon: Chat },
  { label: "내정보", href: "/customer/dashboard", Icon: User },
];

/** 고객 앱 하단 탭바. active는 현재 화면 탭 라벨(예: "상담"). */
export function CustomerBottomNav({ active }: { active: string }) {
  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-line bg-paper-2/[0.92] backdrop-blur">
      {TABS.map(({ label, href, Icon }) => {
        const isActive = label === active;
        return (
          <Link
            key={label}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-1 py-2.5"
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

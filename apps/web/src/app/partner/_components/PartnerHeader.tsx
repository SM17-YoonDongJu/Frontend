"use client";

import Link from "next/link";
import { Scale } from "@/shared/ui/icons/Scale";
import { useProfile } from "../_api/use-profile";
import { NotificationBellMenu } from "./NotificationBellMenu";

// href: null → 준비 중(미구현) 탭. 링크 대신 비활성 표시로 렌더.
const NAV_ITEMS = [
  { label: "홈", href: "/partner", showCount: false },
  { label: "검수 대기", href: "/partner/review", showCount: true },
  { label: "진행 중", href: null, showCount: false },
  { label: "완료", href: null, showCount: false },
] as const;

export function PartnerHeader() {
  const { data } = useProfile();
  const pendingCount = data?.pendingReviewCount;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-navy">
            <Scale className="text-2xl text-gold" />
            바른보상
            <span className="rounded-pill bg-gold px-2 py-0.5 font-sans text-xs font-semibold text-white">
              파트너
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => {
              const badge = item.showCount && pendingCount != null && pendingCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-semibold text-white">
                  {pendingCount}
                </span>
              );

              if (item.href === null) {
                return (
                  <span
                    key={item.label}
                    aria-disabled
                    title="준비 중"
                    className="flex cursor-default items-center gap-1.5 text-sm text-ink-3"
                  >
                    {item.label}
                  </span>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 text-sm text-ink-2 transition hover:text-ink"
                >
                  {item.label}
                  {badge}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBellMenu />
          <Link href="/partner/mypage" className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-lg text-gold">
              <Scale className="text-base" />
            </span>
            {data?.nickname && (
              <span className="hidden text-sm font-medium text-ink-2 sm:inline">
                {data.nickname} 사정사
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

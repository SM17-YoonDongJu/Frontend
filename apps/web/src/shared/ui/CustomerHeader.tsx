import Link from "next/link";
import { Scale } from "@/shared/ui/icons/Scale";
import { User } from "@/shared/ui/icons/User";
import { NotificationBellMenu } from "@/shared/ui/NotificationBellMenu";

/** 고객 페이지 상단 네비게이션 항목. */
const NAV_ITEMS = [
  { label: "보상 분석 신청", href: "/customer/adjust-request" },
  { label: "손해사정사 찾기", href: "/customer/adjusters" },
  { label: "내 리포트", href: "/customer/reports" }
] as const;

/**
 * 고객(customer) 페이지 레이아웃 헤더 셸.
 * 서버 컴포넌트 — 로고·네비·알림·마이페이지 링크. 모바일 메뉴는 후속.
 */
export function CustomerHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-navy">
            <Scale className="text-2xl text-gold" />
            바른보상
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-ink-2 transition hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBellMenu settingsHref="/customer/mypage?panel=notifications" />
          <Link
            href="/customer/mypage"
            aria-label="마이페이지"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-paper-2 text-lg text-ink-2 transition hover:bg-paper hover:text-ink"
          >
            <User />
          </Link>
        </div>
      </div>
    </header>
  );
}

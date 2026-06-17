import Link from "next/link";
import { Scale } from "@/shared/ui/icons/Scale";
import { Bell } from "@/shared/ui/icons/Bell";

const NAV_ITEMS = [
  { label: "검수 대기", href: "#", count: 5 },
  { label: "진행 중", href: "#" },
  { label: "이용안내", href: "#" }
] as const;

const PARTNER_NAME = "김도현 사정사";

export function PartnerHeader() {
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
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 text-sm text-ink-2 transition hover:text-ink"
              >
                {item.label}
                {"count" in item && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-semibold text-white">
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="알림"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-ink-2 transition hover:bg-paper hover:text-ink"
          >
            <Bell />
          </button>
          <button type="button" className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-lg text-gold">
              <Scale className="text-base" />
            </span>
            <span className="hidden text-sm font-medium text-ink-2 sm:inline">{PARTNER_NAME}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

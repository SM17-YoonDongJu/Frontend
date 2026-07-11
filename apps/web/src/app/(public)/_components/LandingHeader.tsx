import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { ArrowRight } from "@/shared/ui/icons/ArrowRight";
import { Scale } from "@/shared/ui/icons/Scale";

const NAV_ITEMS = [
  { label: "서비스 소개", href: "#" },
  { label: "이용 방법", href: "#how-it-works" },
  { label: "손해사정사", href: "#" },
  { label: "요금", href: "#" }
] as const;

/**
 * 랜딩 헤더. md↑: 앵커 내비 + 「무료로 시작」, md↓: 로고 + 「로그인」.
 */
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-2 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center justify-between px-6 md:h-[4.6875rem] md:px-14">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-[0.5rem] bg-navy text-white md:size-[1.875rem] md:bg-gold">
            <Scale className="size-[0.9375rem] md:size-[1.1875rem]" />
          </span>
          <span className="font-serif text-[1.0625rem] font-bold text-ink md:text-[1.25rem]">
            바른보상
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[0.875rem] font-medium text-ink-2 transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/login" className={buttonVariants({ variant: "primary", size: "sm" })}>
            무료로 시작
            <ArrowRight className="size-[0.9375rem]" />
          </Link>
        </div>

        <Link
          href="/login"
          className="text-[0.8125rem] font-bold text-ink-2 transition hover:text-ink md:hidden"
        >
          로그인
        </Link>
      </div>
    </header>
  );
}

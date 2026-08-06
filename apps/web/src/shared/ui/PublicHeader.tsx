import Link from "next/link";
import { buttonVariants } from "@/shared/ui/Button";
import { Scale } from "@/shared/ui/icons/Scale";

const NAV_ITEMS = [
  { label: "서비스 소개", href: "#" },
  { label: "이용방법", href: "#" },
  { label: "고객센터", href: "#" }
] as const;

/**
 * 온보딩 페이지 레이아웃 헤더 셸.
 */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-navy">
          <Scale className="text-2xl text-gold" />
          바른보상
        </Link>

        <div className="flex items-center gap-6">
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

          <div className="flex items-center gap-2">
            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              로그인
            </Link>
            <Link href="/signup" className={buttonVariants({ variant: "primary", size: "sm" })}>
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    heading: "서비스",
    links: [
      { label: "서비스 소개", href: "/about" },
      { label: "이용 방법", href: "/guide" }
    ]
  },
  {
    heading: "고객지원",
    links: [
      { label: "FAQ", href: "/guide#faq" },
      { label: "문의하기", href: "/contact" }
    ]
  },
  {
    heading: "정책",
    links: [
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
      { label: "계정 삭제", href: "/account-deletion" }
    ]
  }
] as const;

const BRAND_TAGLINE = "손해사정 매칭 플랫폼";

/**
 * 공용 푸터. (public)·(customer) 그룹 공용 셸.
 */

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 py-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-lg font-bold text-navy">바른보상</p>
          <p className="mt-3 text-sm text-ink-3">{BRAND_TAGLINE}</p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            <p className="text-sm font-semibold text-ink-2">{column.heading}</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-ink-3">
          © 2026 바른보상. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

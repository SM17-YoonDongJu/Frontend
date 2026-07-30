import Link from "next/link";
import { Scale } from "@/shared/ui/icons/Scale";

const FOOTER_LINKS = [
  { label: "서비스 소개", href: "/about" },
  { label: "이용 방법", href: "/guide" },
  { label: "문의하기", href: "/contact" }
] as const;

const LEGAL_NOTICE =
  "바른보상은 수익을 목적으로 하지 않는 프로젝트입니다. 제공되는 분석은 참고용 추정이며 법적 효력이 없습니다. 손해사정·법률자문이 필요한 경우 등록된 손해사정사 상담으로 연결됩니다.";

/**
 * 랜딩 푸터. 로고·서비스 링크·법적 고지. 모바일은 세로 스택, md↑는 가로 배치.
 */
export function LandingFooter() {
  return (
    <footer className="border-t border-line-2">
      <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:gap-10 md:px-14 md:py-10">
        <div className="flex flex-col gap-4 md:shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex size-[1.875rem] items-center justify-center rounded-[0.5rem] bg-gold text-white">
              <Scale className="size-[1.1875rem]" />
            </span>
            <span className="font-serif text-[1.25rem] font-bold text-ink">바른보상</span>
          </div>
          <nav aria-label="푸터 메뉴" className="flex items-center gap-5">
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[0.8125rem] font-medium text-ink-2 transition hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="max-w-[38.75rem] text-[0.75rem] leading-[1.125rem] text-ink-3">
          {LEGAL_NOTICE}
        </p>
      </div>
    </footer>
  );
}

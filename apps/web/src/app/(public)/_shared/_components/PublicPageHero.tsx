import type { ReactNode } from "react";

interface PublicPageHeroProps {
  kicker: string;
  kickerIcon?: ReactNode;
  title: string;
  subtitle: string;
  /** CTA 버튼 슬롯 */
  children?: ReactNode;
}

/**
 * 공개 마케팅 페이지(about·guide) 공용 히어로 셸.
 * kicker 배지 + serif 제목 + 서브카피 + CTA 슬롯. 문구·CTA는 소비처가 주입.
 */
export function PublicPageHero({ kicker, kickerIcon, title, subtitle, children }: PublicPageHeroProps) {
  return (
    <section className="border-b border-line-2 bg-paper">
      <div className="mx-auto w-full max-w-[80rem] px-6 py-16 text-center md:px-14 md:py-24">
        <span className="inline-flex h-7 items-center gap-1.5 rounded-[0.5rem] bg-gold-soft px-3">
          {kickerIcon}
          <span className="text-[0.8125rem] font-bold text-gold-ink">{kicker}</span>
        </span>

        <h1 className="mx-auto mt-5 max-w-[46rem] whitespace-pre-line font-serif text-[2rem] font-bold leading-[1.25] text-ink md:text-[3rem]">
          {title}
        </h1>

        <p className="mx-auto mt-5 max-w-[40rem] text-[1rem] leading-[1.65] text-ink-2 md:text-[1.125rem]">
          {subtitle}
        </p>

        {children ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>
        ) : null}
      </div>
    </section>
  );
}

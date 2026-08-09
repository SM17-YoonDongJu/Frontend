interface LoginHeroProps {
  variant: "first" | "returning";
}

const HERO_COPY = {
  first: {
    title: "바른보상 시작하기",
    subtitle: "받은 보험금이 적정한지, 전화 없이 확인해요 .",
  },
  returning: {
    title: "다시 만나서 반가워요",
    subtitle: "가입할 때 사용한 방법으로 로그인하세요.",
  },
} as const;

/** 로그인 화면 타이틀·서브카피 (첫 로그인 / 재로그인 variant). */
export function LoginHero({ variant }: LoginHeroProps) {
  const { title, subtitle } = HERO_COPY[variant];

  return (
    <header className="flex w-full flex-col items-center gap-3 text-center">
      <h1 className="font-serif text-[2rem] font-bold leading-[2.6rem] tracking-[-0.01rem] text-ink">
        {title}
      </h1>
      <p className="text-sm leading-6 tracking-[-0.01rem] text-ink-3">{subtitle}</p>
    </header>
  );
}

import { Scale } from "@/shared/ui/icons/Scale";

const LEGAL_NOTICE =
  "바른보상이 제공하는 분석은 참고용 추정이며 법적 효력이 없습니다. 손해사정·법률자문이 필요한 경우 등록된 손해사정사 상담으로 연결됩니다.";

/**
 * 랜딩 푸터. 법적 고지. PC(md↑) 전용 — 모바일 시안엔 푸터가 없다.
 */
export function LandingFooter() {
  return (
    <footer className="hidden border-t border-line-2 md:block">
      <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between gap-10 px-14 py-10">
        <div className="flex items-center gap-2.5">
          <span className="flex size-[1.875rem] items-center justify-center rounded-[0.5rem] bg-gold text-white">
            <Scale className="size-[1.1875rem]" />
          </span>
          <span className="font-serif text-[1.25rem] font-bold text-ink">바른보상</span>
        </div>
        <p className="max-w-[38.75rem] text-[0.75rem] leading-[0.9375rem] text-ink-3">
          {LEGAL_NOTICE}
        </p>
      </div>
    </footer>
  );
}

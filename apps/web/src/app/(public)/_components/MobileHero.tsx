/**
 * 모바일 히어로(md 미만). 문구가 PC와 다른 별도 시안.
 */
export function MobileHero() {
  return (
    <section className="px-6 pt-11">
      <p className="text-[0.75rem] font-bold text-gold-ink">보험 보상, 제대로 받고 계신가요</p>
      <h1 className="mt-[1.8125rem] whitespace-pre-line font-serif text-[1.875rem] font-bold leading-[2.5rem] text-ink">
        {"받아야 할 보상,\n놓친 만큼 찾아드립니다"}
      </h1>
      <p className="mt-[1.0625rem] whitespace-pre-line text-[0.875rem] leading-[1.0625rem] text-ink-3">
        {"AI 분석과 손해사정사 검수로\n내 보험금이 적정했는지 확인하세요."}
      </p>
    </section>
  );
}

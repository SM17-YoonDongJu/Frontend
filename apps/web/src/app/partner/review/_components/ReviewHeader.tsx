/** 검수 대기 화면 헤더 — 오버라인·타이틀·정렬 안내. 정적 표시라 서버 컴포넌트. */
export function ReviewHeader() {
  return (
    <header className="flex flex-col gap-1 px-5 pt-2">
      <p className="text-[0.78rem] font-semibold tracking-[-0.01rem] text-gold-ink">AI 초안 검수</p>
      <h1 className="font-serif text-[1.4375rem] tracking-[-0.01rem] text-ink">검수 대기</h1>
      <p className="text-[0.76rem] tracking-[-0.01rem] text-ink-3">매칭 높은 순으로 정렬했어요.</p>
    </header>
  );
}

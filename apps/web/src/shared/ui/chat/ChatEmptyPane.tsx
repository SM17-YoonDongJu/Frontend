/** md+ 목록 페이지 우측 — 대화 미선택 빈 패널 */
export function ChatEmptyPane() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.9375rem] font-semibold text-ink">대화를 선택하세요</p>
      <p className="mt-1.5 text-[0.8125rem] text-ink-3">
        왼쪽 목록에서 상담을 선택하면 대화가 열려요.
      </p>
    </div>
  );
}

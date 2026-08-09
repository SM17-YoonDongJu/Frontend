const DELETED_ITEMS = [
  "받은 제안과 상담 내역이 모두 삭제됩니다.",
  "주고받은 채팅 대화가 삭제되어 다시 볼 수 없습니다.",
  "요청한 검토 리포트 이력이 삭제됩니다.",
];

export function WithdrawNotice() {
  return (
    <section className="mt-8">
      <div className="rounded-card border border-line-2 bg-paper-2 px-5 py-4">
        <h2 className="text-[0.9375rem] font-semibold text-ink">탈퇴하면 이렇게 됩니다</h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {DELETED_ITEMS.map((item) => (
            <li key={item} className="flex gap-2.5 text-[0.875rem] leading-relaxed text-ink-2">
              <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-3" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 rounded-card bg-terra-soft px-4 py-3 text-[0.8125rem] leading-relaxed text-terra">
        삭제된 정보는 복구할 수 없으며, 같은 계정으로 다시 가입해도 이전 내역은 되살아나지
        않습니다.
      </p>
    </section>
  );
}

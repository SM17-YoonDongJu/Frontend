export function ReviewEmpty() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h2 className="text-[18px] font-semibold text-ink">검수 대기 중인 사건이 없어요</h2>
      <p className="mt-2 text-[14px] text-ink-3">새 사건이 접수되면 여기에 표시돼요.</p>
    </div>
  );
}

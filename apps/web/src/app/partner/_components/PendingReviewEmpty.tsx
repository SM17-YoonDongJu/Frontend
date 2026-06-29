export function PendingReviewEmpty() {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <p className="text-[14px] font-medium text-ink-2">검수 대기 중인 사건이 없어요</p>
      <p className="mt-1 text-[13px] text-ink-3">새 사건이 접수되면 여기에 표시돼요.</p>
    </div>
  );
}

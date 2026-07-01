export function InProgressEmpty() {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <p className="text-[0.875rem] font-medium text-ink-2">진행 중인 사건이 없어요</p>
      <p className="mt-1 text-[0.8125rem] text-ink-3">검수를 시작하면 여기에서 진행 상황을 확인할 수 있어요.</p>
    </div>
  );
}

import { Search } from "@/shared/ui/icons/Search";

export function AdjusterListEmpty() {
  return (
    <div className="col-span-full flex flex-col items-center rounded-card border border-dashed border-line bg-paper-2 px-6 py-14 text-center">
      <span className="mb-3 text-3xl text-ink-3">
        <Search />
      </span>
      <p className="text-sm font-medium text-ink-2">검색 조건에 맞는 손해사정사가 없어요</p>
      <p className="mt-1 text-[0.8125rem] text-ink-3">
        검색어나 전문분야·지역 필터를 바꿔 다시 찾아보세요.
      </p>
    </div>
  );
}

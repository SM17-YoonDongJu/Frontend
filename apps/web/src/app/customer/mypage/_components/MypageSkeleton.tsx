/** 마이페이지 초기 로딩 셸(PC 2컬럼 / 모바일 스택). */
export function MypageSkeleton() {
  return (
    <>
      <div className="hidden gap-7 md:grid md:grid-cols-[14.75rem_minmax(0,1fr)] md:items-start">
        <div className="h-60 animate-pulse rounded-card bg-line-2" />
        <div className="flex flex-col gap-5.5">
          <div className="h-29 animate-pulse rounded-card-lg bg-line-2" />
          <div className="grid grid-cols-2 gap-5.5">
            <div className="h-63 animate-pulse rounded-card bg-line-2" />
            <div className="h-46 animate-pulse rounded-card bg-line-2" />
          </div>
          <div className="h-88 animate-pulse rounded-card bg-line-2" />
        </div>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        <div className="h-46 animate-pulse rounded-card bg-line-2" />
        <div className="h-64 animate-pulse rounded-card bg-line-2" />
        <div className="h-62 animate-pulse rounded-card bg-line-2" />
      </div>
    </>
  );
}

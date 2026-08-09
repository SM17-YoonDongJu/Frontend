export function ReportDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[67.5rem] px-5 pb-9 pt-[1.125rem] lg:px-4 lg:py-8">
      {/* 모바일 상단 바 */}
      <div className="-mx-5 mb-4 h-[3.6875rem] animate-pulse border-b border-line-2 bg-line-2/40 lg:hidden" />
      {/* 데스크톱 헤더 */}
      <div className="hidden h-9 w-64 animate-pulse rounded bg-line-2 lg:block" />

      <div className="mt-[1.125rem] space-y-[1.125rem] lg:mt-6 lg:grid lg:grid-cols-[1fr_20rem] lg:gap-6 lg:space-y-0">
        <div className="space-y-[1.125rem] lg:space-y-6">
          <div className="h-6 w-2/3 animate-pulse rounded bg-line-2 lg:hidden" />
          <div className="h-24 animate-pulse rounded-card bg-line-2 lg:h-28 lg:rounded-card-lg" />
          <div className="h-52 animate-pulse rounded-card bg-line-2 lg:h-44 lg:rounded-card-lg" />
          <div className="h-72 animate-pulse rounded-card bg-line-2 lg:rounded-card-lg" />
        </div>
        <div className="hidden space-y-6 lg:block">
          <div className="h-40 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-44 animate-pulse rounded-card-lg bg-line-2" />
        </div>
      </div>
    </div>
  );
}

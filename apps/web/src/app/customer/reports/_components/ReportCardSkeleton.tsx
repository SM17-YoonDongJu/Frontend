export function ReportCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-card shadow-card">
      <div className="absolute inset-y-4 left-0 w-1 rounded-full bg-line-2" />
      <div className="py-[1.3125rem] pl-[1.625rem] pr-[1.3125rem]">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 animate-pulse rounded-pill bg-line-2" />
          <div className="ml-auto h-4 w-24 animate-pulse rounded-tag bg-line-2" />
        </div>

        <div className="mt-3 h-5 w-52 max-w-full animate-pulse rounded-tag bg-line-2" />

        <div className="mt-3.5">
          <div className="h-3 w-20 animate-pulse rounded-tag bg-line-2" />
          <div className="mt-2 h-7 w-40 animate-pulse rounded-input bg-line-2" />
        </div>

        <div className="mt-[1.125rem] flex items-center justify-between border-t border-line-2 pt-3.5">
          <div className="h-4 w-32 animate-pulse rounded-tag bg-line-2" />
          <div className="h-8 w-24 animate-pulse rounded-button bg-line-2" />
        </div>
      </div>
    </div>
  );
}

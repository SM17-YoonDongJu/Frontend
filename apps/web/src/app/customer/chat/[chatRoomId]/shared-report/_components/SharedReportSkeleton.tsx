export function SharedReportSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[67.5rem] px-5 pb-9 pt-[1.125rem] lg:px-4 lg:py-8">
      <div className="-mx-5 mb-4 h-[3.6875rem] animate-pulse border-b border-line-2 bg-line-2/40 lg:hidden" />
      <div className="hidden h-9 w-64 animate-pulse rounded-card bg-line-2 lg:block" />

      <div className="mt-[1.125rem] space-y-[1.125rem] lg:mt-6 lg:space-y-6">
        <div className="h-40 animate-pulse rounded-card bg-line-2 lg:rounded-card-lg" />
        <div className="h-28 animate-pulse rounded-card bg-line-2 lg:rounded-card-lg" />
        <div className="h-72 animate-pulse rounded-card bg-line-2 lg:rounded-card-lg" />
      </div>
    </div>
  );
}

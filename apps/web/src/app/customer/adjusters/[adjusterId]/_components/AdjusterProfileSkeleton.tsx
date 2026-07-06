export function AdjusterProfileSkeleton() {
  return (
    <div>
      <div className="lg:border-b lg:border-line lg:bg-card">
        <div className="mx-auto w-full max-w-[68.75rem] px-5 pb-6 pt-2 lg:px-4 lg:py-9">
          <div className="mb-4 flex items-center gap-1.5 lg:hidden">
            <div className="size-[2.375rem] animate-pulse rounded-button bg-line-2" />
            <div className="h-4 w-32 animate-pulse rounded bg-line-2" />
          </div>
          <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:gap-7">
            <div className="size-[5.25rem] animate-pulse rounded-full bg-line-2 lg:size-24" />
            <div className="flex flex-col items-center space-y-3 lg:flex-1 lg:items-start">
              <div className="h-8 w-56 animate-pulse rounded bg-line-2 lg:h-9 lg:w-72" />
              <div className="h-4 w-64 animate-pulse rounded bg-line-2 lg:w-96" />
              <div className="h-6 w-60 animate-pulse rounded bg-line-2" />
            </div>
          </div>
          <div className="mt-5 h-20 animate-pulse rounded-card bg-line-2 lg:hidden" />
          <div className="mt-8 hidden grid-cols-3 gap-6 lg:grid">
            <div className="h-16 animate-pulse rounded bg-line-2" />
            <div className="h-16 animate-pulse rounded bg-line-2" />
            <div className="h-16 animate-pulse rounded bg-line-2" />
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-[68.75rem] gap-5 px-5 pb-28 pt-5 lg:grid-cols-[1fr_21.25rem] lg:gap-6 lg:px-4 lg:py-9">
        <div className="space-y-5 lg:space-y-6">
          <div className="h-40 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-60 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-52 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-64 animate-pulse rounded-card-lg bg-line-2" />
        </div>
        <div className="space-y-5 lg:space-y-6">
          <div className="h-80 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-44 animate-pulse rounded-card-lg bg-line-2" />
        </div>
      </div>
    </div>
  );
}

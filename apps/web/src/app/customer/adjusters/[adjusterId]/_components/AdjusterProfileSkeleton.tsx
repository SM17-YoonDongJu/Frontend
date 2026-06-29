export function AdjusterProfileSkeleton() {
  return (
    <div>
      <div className="border-b border-line bg-card">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-9">
          <div className="flex items-center gap-7">
            <div className="size-24 animate-pulse rounded-full bg-line-2" />
            <div className="flex-1 space-y-3">
              <div className="h-9 w-72 animate-pulse rounded bg-line-2" />
              <div className="h-4 w-96 animate-pulse rounded bg-line-2" />
              <div className="h-6 w-60 animate-pulse rounded bg-line-2" />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6">
            <div className="h-16 animate-pulse rounded bg-line-2" />
            <div className="h-16 animate-pulse rounded bg-line-2" />
            <div className="h-16 animate-pulse rounded bg-line-2" />
          </div>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-[1100px] gap-6 px-4 py-9 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="h-40 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-60 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-52 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-64 animate-pulse rounded-card-lg bg-line-2" />
        </div>
        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-44 animate-pulse rounded-card-lg bg-line-2" />
        </div>
      </div>
    </div>
  );
}

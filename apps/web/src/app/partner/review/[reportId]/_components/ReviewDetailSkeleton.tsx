export function ReviewDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="h-9 w-72 animate-pulse rounded bg-line-2" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <div className="h-44 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-28 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-64 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-96 animate-pulse rounded-card-lg bg-line-2" />
        </div>
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-40 animate-pulse rounded-card-lg bg-line-2" />
        </div>
      </div>
    </div>
  );
}

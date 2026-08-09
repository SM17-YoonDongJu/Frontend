export function ActivitySkeleton() {
  return (
    <div className="rounded-card-lg border border-line bg-card p-6">
      <div className="h-6 w-24 animate-pulse rounded-pill bg-line-2" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-6 w-full animate-pulse rounded-pill bg-line-2" />
        ))}
      </div>
      <div className="mt-5 h-20 animate-pulse rounded-card bg-line-2" />
    </div>
  );
}

export function InProgressSkeleton() {
  return (
    <div className="rounded-card-lg border border-line bg-card p-6">
      <div className="h-6 w-28 animate-pulse rounded-pill bg-line-2" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-card bg-line-2" />
        ))}
      </div>
    </div>
  );
}

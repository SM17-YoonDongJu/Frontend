export function PendingReviewSkeleton() {
  return (
    <div className="rounded-card-lg border border-line bg-card p-6">
      <div className="h-6 w-32 animate-pulse rounded-pill bg-line-2" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-card bg-line-2" />
        ))}
      </div>
    </div>
  );
}

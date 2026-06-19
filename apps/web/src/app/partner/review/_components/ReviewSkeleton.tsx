export function ReviewSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-card-lg bg-line-2" />
      ))}
    </div>
  );
}

export function MobilePendingSkeleton() {
  return (
    <div className="space-y-2.5">
      <div className="h-6 w-28 animate-pulse rounded-pill bg-line-2" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-[6.5rem] animate-pulse rounded-card bg-line-2" />
      ))}
    </div>
  );
}

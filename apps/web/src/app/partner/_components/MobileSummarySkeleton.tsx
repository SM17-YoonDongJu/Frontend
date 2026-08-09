export function MobileSummarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-[0.6875rem]">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[7.6875rem] animate-pulse rounded-card bg-line-2" />
      ))}
    </div>
  );
}

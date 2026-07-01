export function SummaryCardsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-card-lg bg-line-2" />
      ))}
    </>
  );
}

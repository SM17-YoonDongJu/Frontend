const PLACEHOLDER_COUNT = 6;

export function PendingReviewSkeleton() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
        <li key={index} className="h-32 animate-pulse rounded-card-lg bg-line-2" />
      ))}
    </ul>
  );
}

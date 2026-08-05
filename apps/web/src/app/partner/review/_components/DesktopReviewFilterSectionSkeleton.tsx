export function DesktopReviewFilterSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-full animate-pulse rounded-pill bg-line-2" />
      <div className="grid gap-6 lg:grid-cols-[1fr_24.5rem]">
        <div className="space-y-3">
          <div className="h-36 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-36 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-36 animate-pulse rounded-card-lg bg-line-2" />
        </div>
        <div className="h-96 animate-pulse rounded-card-lg bg-line-2" />
      </div>
    </div>
  );
}

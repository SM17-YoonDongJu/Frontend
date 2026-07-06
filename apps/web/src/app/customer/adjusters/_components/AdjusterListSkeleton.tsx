const SKELETON_CARD_COUNT = 6;

export function AdjusterListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <div className="space-y-3">
        <div className="h-9 w-56 animate-pulse rounded bg-line-2" />
        <div className="h-4 w-72 animate-pulse rounded bg-line-2" />
      </div>

      <div className="mt-6 hidden h-24 animate-pulse rounded-card-lg bg-line-2 md:block" />

      <div className="mt-6 h-[2.875rem] animate-pulse rounded-input bg-line-2" />

      <div className="mt-6 grid gap-6 md:grid-cols-[15.5rem_1fr]">
        <div className="hidden h-80 animate-pulse rounded-card bg-line-2 md:block" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-card bg-line-2 md:h-72" />
          ))}
        </div>
      </div>
    </div>
  );
}

const SKELETON_CARD_COUNT = 3;

export function ReviewSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 pt-3">
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
        <div key={i} className="h-[11.5rem] animate-pulse rounded-card bg-line-2" />
      ))}
    </div>
  );
}

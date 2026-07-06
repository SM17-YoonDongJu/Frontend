const SKELETON_CARD_COUNT = 4;

export function ReviewHistorySkeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 pt-3 pb-5">
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
        <div key={i} className="h-[7.5rem] animate-pulse rounded-card bg-line-2" />
      ))}
    </div>
  );
}

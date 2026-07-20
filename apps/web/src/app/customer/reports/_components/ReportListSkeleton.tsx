const SKELETON_CARD_COUNT = 5;

export function ReportListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[42rem] px-5 pt-6 pb-10 md:px-0 md:pt-10">
      <div className="h-9 w-40 animate-pulse rounded-input bg-line-2" />
      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
          <div key={i} className="h-[8.5rem] animate-pulse rounded-card bg-line-2" />
        ))}
      </div>
    </div>
  );
}

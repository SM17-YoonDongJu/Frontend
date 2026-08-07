const SKELETON_CARD_COUNT = 4;

export function ReportListSkeleton() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[25.125rem] flex-col bg-paper md:min-h-0 md:max-w-6xl md:px-6 md:py-10">
      <div className="px-5 pt-7 pb-4 md:px-0 md:pt-0 md:pb-8">
        <div className="h-[1.75rem] w-32 animate-pulse rounded-tag bg-line-2 md:h-[2.5rem] md:w-40" />
      </div>
      <div className="flex flex-col gap-3 px-5 pt-1 pb-5 md:grid md:grid-cols-2 md:gap-6 md:px-0 md:pb-8">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
          <div key={i} className="h-[7.5rem] animate-pulse rounded-card bg-line-2" />
        ))}
      </div>
    </div>
  );
}

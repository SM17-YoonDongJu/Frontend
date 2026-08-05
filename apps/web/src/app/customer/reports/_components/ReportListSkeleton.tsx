import { ReportCardSkeleton } from "./ReportCardSkeleton";

const SKELETON_CARD_COUNT = 5;

export function ReportListSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[42rem] px-5 pt-6 pb-14 md:px-0 md:pt-10">
      <div className="h-3 w-24 animate-pulse rounded-tag bg-line-2" />
      <div className="mt-2 h-8 w-40 animate-pulse rounded-input bg-line-2" />
      <div className="mt-3 h-3.5 w-64 max-w-full animate-pulse rounded-tag bg-line-2" />

      <div className="mt-6 flex flex-col gap-3.5">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
          <ReportCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

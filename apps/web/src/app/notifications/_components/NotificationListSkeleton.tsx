const SKELETON_CARD_COUNT = 4;

export function NotificationListSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-2 px-5 pt-5">
      <div className="h-[0.9375rem] w-10 animate-pulse rounded-tag bg-line-2" />
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
        <div
          key={index}
          className="h-[4.125rem] animate-pulse rounded-input border border-line-2 bg-paper-2"
        />
      ))}
    </div>
  );
}

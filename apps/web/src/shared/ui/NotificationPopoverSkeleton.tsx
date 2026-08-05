const SKELETON_ROW_COUNT = 3;

export function NotificationPopoverSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-2 px-5 py-4">
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-input bg-paper-2" />
      ))}
    </div>
  );
}

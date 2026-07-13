const ROW_COUNT = 4;

export function ChatListSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="px-5 pb-3 pt-1">
        <div className="h-7 w-24 rounded-tag bg-line-2" />
      </div>
      <div className="px-5 pb-2">
        <div className="h-12 w-full rounded-input bg-line-2" />
      </div>
      <ul>
        {Array.from({ length: ROW_COUNT }).map((_, index) => (
          <li key={index} className="flex items-center gap-3 px-4 py-3.5">
            <div className="size-[2.875rem] shrink-0 rounded-full bg-line-2" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 rounded-tag bg-line-2" />
              <div className="h-3 w-2/3 rounded-tag bg-line-2" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SKELETON_CARD_COUNT = 4;

export function ReceivedProposalsSkeleton() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[25.125rem] flex-col bg-paper">
      <div className="px-5 pt-7 pb-4">
        <div className="h-[1.75rem] w-32 animate-pulse rounded-tag bg-line-2" />
      </div>
      <div className="flex flex-col gap-3 px-5 pt-1 pb-5">
        {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
          <div key={i} className="h-[7.5rem] animate-pulse rounded-card bg-line-2" />
        ))}
      </div>
    </div>
  );
}

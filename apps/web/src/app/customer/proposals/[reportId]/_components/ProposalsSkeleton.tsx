export function ProposalsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-8">
      <div className="h-4 w-20 animate-pulse rounded bg-line-2" />
      <div className="mt-3 h-9 w-72 animate-pulse rounded bg-line-2" />
      <div className="mt-6 h-24 animate-pulse rounded-card-lg bg-line-2" />
      <div className="mt-6 space-y-4">
        <div className="h-44 animate-pulse rounded-card-lg bg-line-2" />
        <div className="h-44 animate-pulse rounded-card-lg bg-line-2" />
        <div className="h-44 animate-pulse rounded-card-lg bg-line-2" />
      </div>
    </div>
  );
}

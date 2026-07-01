export function ProfileEditSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="h-9 w-48 animate-pulse rounded bg-line-2" />
      <div className="mt-6 grid gap-7 lg:grid-cols-[40.75rem_21.25rem]">
        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-44 animate-pulse rounded-card-lg bg-line-2" />
          <div className="h-56 animate-pulse rounded-card-lg bg-line-2" />
        </div>
        <div className="h-52 animate-pulse rounded-card-lg bg-line-2" />
      </div>
    </div>
  );
}
